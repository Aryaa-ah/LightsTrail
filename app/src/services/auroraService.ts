/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/auroraService.ts
import axios from "axios";
import {
  GEO_CONSTANTS,
  calculateAuroraProbability,
  haversineDistance,
} from "./aurorautils";
import kdTree from "kd-tree-javascript";
const KDTree = kdTree.kdTree; // Get the constructor

interface NoaaPoint {
  0: number; // latitude
  1: number; // longitude
  2: number; // probability
}

interface NoaaResponse {
  coordinates: NoaaPoint[];
}

// Define types for better type safety
interface AuroraZone {
  lat: number;
  lon: number;
  name: string;
}

interface AuroraConstants {
  MIN_PROBABILITY: number;
  OPTIMAL_LATITUDE_NORTH: number;
  OPTIMAL_LATITUDE_SOUTH: number;
  MAX_LATITUDE_DISTANCE: number;
  PROBABILITY_BOOST: number;
  GRID_DENSITY: number;
  MIN_KP_INDEX: number;
  NEAREST_POINTS: number;
  LAT_RANGE: { MIN: number; MAX: number };
  LON_RANGE: { MIN: number; MAX: number };
  MIN_SPOT_DISTANCE_KM: number;
  CLUSTER_RADIUS_KM: number;
  KP_WEIGHT: number;
  LOCATION_WEIGHT: number;
  SOLAR_WIND_WEIGHT: number;
  BZ_WEIGHT: number;
  AURORA_ZONES: ReadonlyArray<AuroraZone>;
}

const NOAA_ENDPOINTS = {
  OVATION: "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json",
  KP_INDEX: "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json",
  SOLAR_WIND:
    "https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json",
  MAG_FIELD:
    "https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json",
} as const;

const AURORA_CONSTANTS: AuroraConstants = {
  MIN_PROBABILITY: 1.5,

  // Broadened optimal viewing latitudes
  OPTIMAL_LATITUDE_NORTH: 50, // Lower to include more areas
  OPTIMAL_LATITUDE_SOUTH: -80,

  // Significantly increased for broader coverage
  MAX_LATITUDE_DISTANCE: 65,

  // Adjusted for more realistic predictions
  PROBABILITY_BOOST: 1.5,

  // Finer grid for more complete coverage
  GRID_DENSITY: 5,

  // Lowered to catch more events
  MIN_KP_INDEX: 1,

  // Increased for better interpolation
  NEAREST_POINTS: 10,

  // Expanded ranges
  LAT_RANGE: { MIN: -90, MAX: 90 },
  LON_RANGE: { MIN: -180, MAX: 180 },

  // Reduced for more granular spot detection
  MIN_SPOT_DISTANCE_KM: 500,
  CLUSTER_RADIUS_KM: 40,

  // Adjust weights
  KP_WEIGHT: 0.45,
  LOCATION_WEIGHT: 0.2,
  SOLAR_WIND_WEIGHT: 0.25,
  BZ_WEIGHT: 0.1,
  AURORA_ZONES: [
    // North America
    { lat: 64.8, lon: -147.7, name: "Fairbanks, Alaska" },
    { lat: 62.4, lon: -114.4, name: "Yellowknife, Canada" },
    { lat: 58.4, lon: -134.2, name: "Juneau, Alaska" },
    { lat: 53.5, lon: -113.5, name: "Edmonton, Canada" },

    // Northern Europe
    { lat: 69.6, lon: 18.9, name: "Tromsø, Norway" },
    { lat: 68.4, lon: 27.4, name: "Inari, Finland" },
    { lat: 67.8, lon: 20.2, name: "Kiruna, Sweden" },
    { lat: 64.1, lon: -21.9, name: "Reykjavik, Iceland" },
    { lat: 78.2, lon: 15.6, name: "Longyearbyen, Svalbard" },
    { lat: 61.5, lon: 23.8, name: "Tampere, Finland" },

    // Northern Russia
    { lat: 68.9, lon: 33.0, name: "Murmansk, Russia" },
    { lat: 64.5, lon: 40.5, name: "Arkhangelsk, Russia" },
    { lat: 69.3, lon: 88.2, name: "Norilsk, Russia" },

    // Southern Hemisphere
    { lat: -77.8, lon: 166.6, name: "McMurdo Station, Antarctica" },
    { lat: -64.8, lon: -64.0, name: "Vernadsky Station, Antarctica" },
    { lat: -51.7, lon: -57.8, name: "Stanley, Falkland Islands" },
    { lat: -46.4, lon: 168.3, name: "Invercargill, New Zealand" },
  ],
} as const;

// Validate constants
Object.freeze(AURORA_CONSTANTS);
Object.freeze(NOAA_ENDPOINTS);

// Add runtime validation
function validateConstants(constants: AuroraConstants): void {
  const totalWeight = Number(
    (
      constants.KP_WEIGHT +
      constants.LOCATION_WEIGHT +
      constants.SOLAR_WIND_WEIGHT +
      constants.BZ_WEIGHT
    ).toFixed(10)
  );

  if (Math.abs(totalWeight - 1) > 1e-10) {
    throw new Error(`Weights must sum to 1, got ${totalWeight}`);
  }

  if (constants.MIN_PROBABILITY < 0 || constants.MIN_PROBABILITY > 100) {
    throw new Error("MIN_PROBABILITY must be between 0 and 100");
  }
}

validateConstants(AURORA_CONSTANTS);

export interface AuroraPrediction {
  id: string;
  coordinates: [number, number];
  probability: number;
  kpIndex: number;
  visibility: number;
  cloudCover: number;
  temperature: number;
  rating: number;
  updatedAt: string;
  location: string;
}

class AuroraKDTree {
  private tree: any;

  constructor(points: NoaaPoint[]) {
    try {
      const formattedPoints = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
        probability: point[2],
      }));

      const distanceFunction = (a: any, b: any) =>
        haversineDistance(a.latitude, a.longitude, b.latitude, b.longitude);

      // Initialize KD-Tree
      this.tree = new KDTree(formattedPoints, distanceFunction, [
        "latitude",
        "longitude",
      ]);
    } catch (error) {
      console.error("Failed to initialize KD-Tree:", error);
      throw new Error("KD-Tree initialization failed");
    }
  }

  nearest(point: [number, number], count: number): NoaaPoint[] {
    try {
      const results = this.tree.nearest(
        { latitude: point[0], longitude: point[1] },
        count
      );
      console.log("Found nearest points for:", point, "Count:", results.length);
      return results
        .map(([node]: any) => {
          if (!node || typeof node.probability !== "number") {
            console.warn("Invalid node data:", node);
            return null;
          }
          return [node.latitude, node.longitude, node.probability];
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error finding nearest points:", error);
      return [];
    }
  }
}

const auroraService = {
  parseKpIndexData(data: any[]): number {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("Invalid KP data format, using fallback");
        return AURORA_CONSTANTS.MIN_KP_INDEX;
      }

      const recentValidEntry = [...data]
        .reverse()
        .find((entry) => entry?.kp_index > 0);

      if (recentValidEntry) {
        return recentValidEntry.kp_index;
      }

      const recentEstimated = [...data]
        .reverse()
        .find((entry) => entry?.estimated_kp > 0);

      if (recentEstimated) {
        return Math.ceil(recentEstimated.estimated_kp);
      }

      console.warn("No valid KP index found, using fallback");
      return AURORA_CONSTANTS.MIN_KP_INDEX;
    } catch (error) {
      console.error("Error parsing KP index:", error);
      return AURORA_CONSTANTS.MIN_KP_INDEX;
    }
  },

  async getPredictions(): Promise<AuroraPrediction[]> {
    try {
      console.log("Starting predictions...");

      // 1. Fetch all data with debug logging
      console.log("Fetching NOAA data...");
      const [ovationResponse, kpResponse, solarWindResponse, magFieldResponse] =
        await Promise.all([
          axios.get<NoaaResponse>(NOAA_ENDPOINTS.OVATION),
          axios.get(NOAA_ENDPOINTS.KP_INDEX),
          axios.get(NOAA_ENDPOINTS.SOLAR_WIND),
          axios.get(NOAA_ENDPOINTS.MAG_FIELD),
        ]);

      // 2. Log raw data for debugging
      console.log("Data fetched, processing...");
      console.log("KP Response:", kpResponse.data?.length, "entries");
      console.log(
        "Solar Wind Response:",
        solarWindResponse.data?.length,
        "entries"
      );
      console.log(
        "Mag Field Response:",
        magFieldResponse.data?.length,
        "entries"
      );
      console.log("Ovation Points:", ovationResponse.data?.coordinates?.length);

      // 3. Extract values with validation
      const kpIndex = this.parseKpIndexData(kpResponse.data);
      console.log("KP Index:", kpIndex);

      // 4. Extract solar wind data with validation
      const solarWindData = solarWindResponse.data;
      const solarWindSpeed =
        Array.isArray(solarWindData) && solarWindData.length > 1
          ? parseFloat(solarWindData[solarWindData.length - 1][1])
          : 400;
      console.log("Solar Wind Speed:", solarWindSpeed);

      // 5. Extract magnetic field data with validation
      const magFieldData = magFieldResponse.data;
      const bzComponent =
        Array.isArray(magFieldData) && magFieldData.length > 1
          ? parseFloat(magFieldData[magFieldData.length - 1][3])
          : 0;
      console.log("Bz Component:", bzComponent);

      // 6. Validate ovation data
      if (!ovationResponse.data?.coordinates?.length) {
        throw new Error("Invalid ovation data");
      }

      // 7. Initialize KD-Tree with logging
      console.log("Initializing KD-Tree...");
      const kdTree = new AuroraKDTree(ovationResponse.data.coordinates);
      console.log("KD-Tree initialized");

      const predictions: AuroraPrediction[] = [];
      let processedPoints = 0;
      let skippedPoints = 0;
      let lowProbPoints = 0;

      console.log("Starting grid generation...");

      // Focus on auroral zones
      for (let lat = 45; lat <= 85; lat += AURORA_CONSTANTS.GRID_DENSITY) {
        for (let lon = -180; lon <= 180; lon += AURORA_CONSTANTS.GRID_DENSITY) {
          const nearest = kdTree.nearest(
            [lat, lon],
            AURORA_CONSTANTS.NEAREST_POINTS
          );

          if (!nearest.length) {
            skippedPoints++;
            continue;
          }

          const baseProbability = this.calculateInterpolatedProbability(
            nearest,
            lat,
            lon
          );

          // Debug probability calculation
          console.debug(`Point ${lat.toFixed(1)}°, ${lon.toFixed(1)}°:`, {
            baseProbability,
            kpIndex,
            solarWindSpeed,
            bzComponent,
          });

          const probability = calculateAuroraProbability(
            baseProbability,
            lat,
            kpIndex,
            solarWindSpeed,
            bzComponent,
            0
          );

          processedPoints++;

          if (probability < AURORA_CONSTANTS.MIN_PROBABILITY) {
            lowProbPoints++;
            continue;
          }

          predictions.push({
            id: `spot-${predictions.length}`,
            coordinates: [lat, lon],
            probability: Math.round(probability),
            kpIndex,
            visibility: 0,
            cloudCover: 0,
            temperature: 0,
            rating: 0,
            updatedAt: new Date().toISOString(),
            location: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
          });

          if (processedPoints % 100 === 0) {
            console.log(
              `Processed ${processedPoints} points, found ${predictions.length} spots...`
            );
          }
        }
      }

      // Southern hemisphere
      for (let lat = -85; lat <= -45; lat += AURORA_CONSTANTS.GRID_DENSITY) {
        for (let lon = -180; lon <= 180; lon += AURORA_CONSTANTS.GRID_DENSITY) {
          const nearest = kdTree.nearest(
            [lat, lon],
            AURORA_CONSTANTS.NEAREST_POINTS
          );

          if (!nearest.length) {
            skippedPoints++;
            continue;
          }

          const baseProbability = this.calculateInterpolatedProbability(
            nearest,
            lat,
            lon
          );

          const probability = calculateAuroraProbability(
            baseProbability,
            lat,
            kpIndex,
            solarWindSpeed,
            bzComponent,
            0
          );

          processedPoints++;

          if (probability < AURORA_CONSTANTS.MIN_PROBABILITY) {
            lowProbPoints++;
            continue;
          }

          predictions.push({
            id: `spot-${predictions.length}`,
            coordinates: [lat, lon],
            probability: Math.round(probability),
            kpIndex,
            visibility: 0,
            cloudCover: 0,
            temperature: 0,
            rating: 0,
            updatedAt: new Date().toISOString(),
            location: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
          });

          if (processedPoints % 100 === 0) {
            console.log(
              `Processed ${processedPoints} points, found ${predictions.length} spots...`
            );
          }
        }
      }

      console.log(`Processing summary:
        Total points: ${processedPoints}
        Skipped points: ${skippedPoints}
        Low probability points: ${lowProbPoints}
        Valid spots found: ${predictions.length}
      `);

      const finalPredictions = predictions
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 50);

      console.log("Final predictions:", finalPredictions.length);
      return finalPredictions;
    } catch (error) {
      console.error("Error in getPredictions:", error);
      throw error;
    }
  },

  extractLatestValue(data: any[], index: number): number {
    try {
      if (!Array.isArray(data) || !data.length) {
        throw new Error("Invalid data format");
      }

      // Log raw data for debugging
      console.debug("Extracting value from:", { data, index });

      // Handle different data formats
      const validData =
        data[0] && typeof data[0][0] === "string" ? data.slice(1) : data;

      // Find last valid numeric value
      for (let i = validData.length - 1; i >= 0; i--) {
        const value = parseFloat(validData[i][index]);
        if (!isNaN(value)) {
          console.debug("Found valid value:", value);
          return value;
        }
      }

      throw new Error("No valid numeric value found");
    } catch (error) {
      console.error("Error extracting value:", error);
      return this.getFallbackValue(index);
    }
  },

  getFallbackValue(index: number): number {
    const defaults: { [key: number]: number } = {
      1: 3, // KP Index
      2: 400, // Solar wind speed
      3: -0.5, // Bz component
    };
    return defaults[index] || 0;
  },

  // Add a new method to validate response data
  validateResponseData(response: any, type: string): boolean {
    if (!response?.data) {
      console.warn(`Empty ${type} response`);
      return false;
    }

    switch (type) {
      case "kp":
        return Array.isArray(response.data) && response.data.length > 1;
      case "ovation":
        return (
          Array.isArray(response.data?.coordinates) &&
          response.data.coordinates.length > 0
        );
      case "solar":
      case "magnetic":
        return (
          Array.isArray(response.data) &&
          response.data.length > 1 &&
          response.data[1]?.length >= 3
        );
      default:
        return false;
    }
  },

  calculateInterpolatedProbability(
    nearest: NoaaPoint[],
    lat: number,
    lon: number
  ): number {
    if (nearest.length === 0) return 0;

    // Add latitude-based boost for auroral zones
    const latitudeBoost = Math.exp(
      -Math.pow(
        Math.abs(Math.abs(lat) - AURORA_CONSTANTS.OPTIMAL_LATITUDE_NORTH),
        2
      ) / 200
    );

    const weights = nearest.map((point) => {
      const distance = haversineDistance(lat, lon, point[0], point[1]);
      return 1 / Math.pow(distance + 1, 2); // Squared distance for better weighting
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const baseProb =
      nearest.reduce((acc, point, i) => acc + point[2] * weights[i], 0) /
      totalWeight;

    return baseProb * (1 + latitudeBoost);
  },
  async fetchNoaaData() {
    try {
      const response = await axios.get<NoaaResponse>(NOAA_ENDPOINTS.OVATION);
      if (!response.data?.coordinates?.length) {
        throw new Error("Invalid NOAA data format");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching NOAA data:", error);
      throw new Error(
        `Failed to fetch NOAA data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  findBestViewingSpots(
    points: NoaaPoint[],
    kpIndex: number,
    solarWindSpeed: number,
    bzComponent: number
  ): AuroraPrediction[] {
    const predictions: AuroraPrediction[] = [];
    const usedLocations = new Set<string>();

    // Start from known aurora zones
    for (const zone of AURORA_CONSTANTS.AURORA_ZONES) {
      const nearest = this.findNearbyPoints(points, zone.lat, zone.lon, 500);

      if (nearest.length === 0) continue;

      const baseProbability = this.calculateInterpolatedProbability(
        nearest,
        zone.lat,
        zone.lon
      );
      const probability = calculateAuroraProbability(
        baseProbability,
        zone.lat,
        kpIndex,
        solarWindSpeed,
        bzComponent,
        0
      );

      if (probability >= AURORA_CONSTANTS.MIN_PROBABILITY) {
        const locationKey = `${Math.round(zone.lat)},${Math.round(zone.lon)}`;
        if (!usedLocations.has(locationKey)) {
          predictions.push(
            this.createPrediction(zone.lat, zone.lon, probability, kpIndex)
          );
          usedLocations.add(locationKey);
        }
      }
    }

    // Then look for additional spots with good probability
    for (const point of points) {
      const lat = point[0],
        lon = point[1],
        baseProb = point[2];

      // Skip if too close to existing predictions
      if (this.isTooCloseToExisting(lat, lon, predictions)) continue;

      const probability = calculateAuroraProbability(
        baseProb,
        lat,
        kpIndex,
        solarWindSpeed,
        bzComponent,
        0
      );

      if (probability >= AURORA_CONSTANTS.MIN_PROBABILITY) {
        const locationKey = `${Math.round(lat)},${Math.round(lon)}`;
        if (!usedLocations.has(locationKey)) {
          predictions.push(
            this.createPrediction(lat, lon, probability, kpIndex)
          );
          usedLocations.add(locationKey);
        }
      }
    }

    return predictions.sort((a, b) => b.probability - a.probability);
  },

  findNearbyPoints(
    points: NoaaPoint[],
    lat: number,
    lon: number,
    radiusKm: number
  ): NoaaPoint[] {
    return points.filter(
      (point) => haversineDistance(lat, lon, point[0], point[1]) <= radiusKm
    );
  },

  isTooCloseToExisting(
    lat: number,
    lon: number,
    predictions: AuroraPrediction[]
  ): boolean {
    return predictions.some(
      (pred) =>
        haversineDistance(lat, lon, pred.coordinates[0], pred.coordinates[1]) <
        AURORA_CONSTANTS.MIN_SPOT_DISTANCE_KM
    );
  },

  createPrediction(
    lat: number,
    lon: number,
    probability: number,
    kpIndex: number
  ): AuroraPrediction {
    return {
      id: `spot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      coordinates: [lat, lon],
      probability: Math.round(probability),
      kpIndex,
      visibility: this.calculateVisibility(lat), // Calculate based on latitude
      cloudCover: 0, // Will be enriched by weather data
      temperature: 0, // Will be enriched by weather data
      rating: 0, // Will be calculated later
      updatedAt: new Date().toISOString(),
      location: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    };
  },

  calculateEnhancedVisibility(latitude: number, kpIndex: number): number {
    const latitudeOptimality = Math.max(
      0,
      100 -
        Math.abs(Math.abs(latitude) - AURORA_CONSTANTS.OPTIMAL_LATITUDE_NORTH) *
          2
    );
    const kpVisibility = (kpIndex / 9) * 100;
    const visibility = kpVisibility * 0.6 + latitudeOptimality * 0.4;
    return Number(Math.max(0, Math.min(100, visibility)).toFixed(4));
  },

  calculateVisibility(latitude: number): number {
    const latDistance = Math.abs(
      Math.abs(latitude) - AURORA_CONSTANTS.OPTIMAL_LATITUDE_NORTH
    );
    return Number(Math.max(0, Math.min(100, 100 - latDistance * 2)).toFixed(4));
  },
};

export default auroraService;
