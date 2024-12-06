// service/services/auroraPredictionService.js

import axios from "axios";
import { calculateDistance } from '../utils/geoUtils.js';

const NOAA_ENDPOINTS = {
  OVATION: "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json",
  KP_INDEX: "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
  SOLAR_WIND: "https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json",
  MAG_FIELD: "https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json"
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class AuroraPredictionService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.staleTimeout = 30 * 60 * 1000; // 30 minutes
  }

  async fetchWithCache(url, key) {
    try {
      // Check cache first
      const cached = this.cache.get(key);
      const now = Date.now();

      // Return fresh cache
      if (cached && (now - cached.timestamp) < this.cacheTimeout) {
        return cached.data;
      }

      // Try to fetch new data with retries
      let error;
      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const response = await axios.get(url, {
            timeout: 5000,
            validateStatus: status => status === 200
          });

          if (!response.data) {
            throw new Error('Empty response received');
          }

          // Validate data structure based on endpoint type
          this.validateResponse(key, response.data);

          // Update cache
          this.cache.set(key, {
            data: response.data,
            timestamp: now
          });

          return response.data;

        } catch (e) {
          error = e;
          if (i < MAX_RETRIES - 1) {
            await new Promise(r => setTimeout(r, RETRY_DELAY * (i + 1)));
          }
        }
      }

      // All retries failed - check for stale cache
      if (cached && (now - cached.timestamp) < this.staleTimeout) {
        console.warn(`Using stale cache for ${key}, fetch error: ${error.message}`);
        return cached.data;
      }

      throw error;

    } catch (error) {
      // Log error details
      console.error(`Failed to fetch ${key} data:`, {
        url,
        error: error.message,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });

      throw new Error(`Failed to fetch ${key} data: ${error.message}`);
    }
  }

  validateResponse(key, data) {
    switch(key) {
      case 'ovation':
        if (!data.coordinates?.length) {
          throw new Error('Invalid ovation data format');
        }
        break;
      case 'kpIndex':
        if (!Array.isArray(data) || data.length < 2) {
          throw new Error('Invalid Kp index data format');
        }
        break;
      case 'solarWind':
      case 'magField':
        if (!Array.isArray(data) || data.length < 2) {
          throw new Error(`Invalid ${key} data format`);
        }
        // Validate expected columns exist
        const row = data[1];
        if (!row || row.length < 3) {
          throw new Error(`Missing required columns in ${key} data`);
        }
        break;
      default:
        throw new Error(`Unknown data type: ${key}`);
    }
  }

  clearStaleCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.staleTimeout) {
        this.cache.delete(key);
      }
    }
  }

  async fetchAllData() {
    try {
      const [ovationData, kpIndexData, solarWindData, magFieldData] = 
        await Promise.all([
          this.fetchWithCache(NOAA_ENDPOINTS.OVATION, "ovation"),
          this.fetchWithCache(NOAA_ENDPOINTS.KP_INDEX, "kpIndex"), 
          this.fetchWithCache(NOAA_ENDPOINTS.SOLAR_WIND, "solarWind"),
          this.fetchWithCache(NOAA_ENDPOINTS.MAG_FIELD, "magField")
        ]);

      // Validate data
      if (!this.validateNoaaData(ovationData, kpIndexData, solarWindData, magFieldData)) {
        throw new Error("Invalid NOAA data format");
      }

      return { ovationData, kpIndexData, solarWindData, magFieldData };
    } catch (error) {
      throw new Error(`Error fetching NOAA data: ${error.message}`);
    }
  }

  validateNoaaData(ovationData, kpIndexData, solarWindData, magFieldData) {
    return (
      ovationData?.coordinates?.length > 0 &&
      Array.isArray(kpIndexData) && kpIndexData.length > 1 &&
      Array.isArray(solarWindData) && solarWindData.length > 1 &&
      Array.isArray(magFieldData) && magFieldData.length > 1
    );
  }

  async generatePredictions() {
    try {
      const noaaData = await this.fetchAllData();
      const latestKp = this.getLatestKpIndex(noaaData.kpIndexData);
      const { speed: solarWindSpeed, bzComponent } = 
        this.getLatestSolarWindData(noaaData.solarWindData, noaaData.magFieldData);

      const viewingSpots = noaaData.ovationData.coordinates
        .map((point, index) => {
          const probability = this.calculateAuroraProbability(
            point, 
            latestKp,
            solarWindSpeed,
            bzComponent
          );
          
          // Only create spots with actual probability
          if (probability > 30 && point[2] > 0) {
            return {
              id: `spot-${index}`,
              coordinates: [point[1], point[0]],
              probability: Math.round(probability),
              kpIndex: latestKp,
              solarWindSpeed,
              bzComponent,
              visibility: 0, // Will be enriched by controller
              cloudCover: 0, // Will be enriched by controller
              temperature: 0, // Will be enriched by controller
              rating: 0, // Will be calculated by controller
              updatedAt: new Date().toISOString(),
              location: '', // Will be enriched by controller
            };
          }
          return null;
        })
        .filter(spot => spot !== null)
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 10);

      if (viewingSpots.length === 0) {
        throw new Error("No valid viewing spots found");
      }

      return viewingSpots;
    } catch (error) {
      throw new Error(`Error generating predictions: ${error.message}`);
    }
  }

  calculateAuroraProbability(gridPoint, kpIndex, solarWindSpeed, bzComponent) {
    try {
      let probability = gridPoint[2]; // Base probability
      
      // KP index influence (0-9 scale)
      probability *= 1 + (kpIndex / 9); 

      // Solar wind influence (normalized to typical range 300-800 km/s)
      const normalizedWindSpeed = (solarWindSpeed - 300) / 500;
      probability *= 1 + normalizedWindSpeed;

      // Magnetic field influence (negative Bz is favorable)
      if (bzComponent < 0) {
        probability *= 1 + Math.abs(bzComponent) / 10;
      }

      return Math.min(100, Math.max(0, probability));
    } catch (error) {
      console.error("Error calculating probability:", error);
      return 0;
    }
  }

  // Find nearest grid points to user location
  findNearestGridPoints(latitude, longitude, ovationData) {
    return ovationData.coordinates
      .map((point, index) => ({
        point,
        distance: calculateDistance(latitude, longitude, point[0], point[1]),
        value: ovationData.coordinates[index][2]
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
  }

  getLatestKpIndex(kpIndexData) {
    // Skip header row and get latest value
    return parseFloat(kpIndexData[kpIndexData.length - 1][1]);
  }

  getLatestSolarWindData(solarWindData, magFieldData) {
    // Skip header row and get latest values
    const latestWind = solarWindData[solarWindData.length - 1];
    const latestMag = magFieldData[magFieldData.length - 1];

    return {
      speed: parseFloat(latestWind[1]),
      bzComponent: parseFloat(latestMag[3]),
    };
  }

  findBestViewingSpots(ovationData, kpIndex, solarWindSpeed, bzComponent) {
    const gridPoints = ovationData.coordinates;
    const spots = [];

    // Look for points with high aurora activity and actual data
    gridPoints.forEach((point, index) => {
      const probability = this.calculateAuroraProbability(
        point,
        kpIndex,
        solarWindSpeed, 
        bzComponent
      );

      // Only include spots with real probability data
      if (probability > 30 && point[2] > 0) { // Check if there's actual aurora activity
        spots.push({
          id: `spot-${index}`,
          coordinates: [point[0], point[1]],
          probability,
          kpIndex,
          solarWindSpeed,
          bzComponent,
          visibility: Math.floor(Math.random() * (100 - 40) + 40), // Will be replaced with real data
          temperature: Math.floor(Math.random() * (15 + 30) - 30), // Will be replaced with real data
          updatedAt: new Date().toISOString(),
        });
      }
    });

    // Filter out any predefined/static locations
    return spots
      .filter(spot => spot.probability > 0) // Only return spots with actual probability
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 10);
  }
}

export default new AuroraPredictionService();
