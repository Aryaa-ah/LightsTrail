/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Divider,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { FixedSizeList as VirtualList } from "react-window";
import { ViewingSpot } from "../types/auroraPred.types";
import ViewingSpotCard from "./ViewingSpots";
import { format } from "date-fns";

// Define LocationData interface
interface LocationData {
  displayName: string;
  coordinates: [number, number];
}

// Enhanced cache interface with error tracking
interface LocationCache {
  [key: string]: {
    location: LocationData;
    timestamp: number;
    errorCount?: number;
    weather?: WeatherData;
  };
}

const locationCache: LocationCache = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const BATCH_SIZE = 3;
const DELAY_BETWEEN_REQUESTS = 1500;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const ERROR_CACHE_DURATION = 30 * 60 * 1000; // Cache errors for 30 minutes

// Enhanced sleep function with jitter
const sleep = async (ms: number) => {
  const jitter = Math.random() * 500; // Add random delay up to 500ms
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
};

// First add the interface for weather data
interface WeatherData {
  temperature: number;
  cloudCover: number;
  visibility: number;
}

// Update the weather data fetching
const fetchWeatherData = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("OpenWeather API key not configured");
    throw new Error("API key missing");
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Weather data received:", data);

    return {
      temperature: data.main.temp,
      cloudCover: data.clouds.all,
      visibility: Math.min(data.visibility / 100, 100),
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return {
      temperature: 0,
      cloudCover: 0,
      visibility: 0,
    };
  }
};

// Update the location and weather fetching
const fetchLocationAndWeather = async (
  lat: number,
  lon: number,
  retryCount = 0
): Promise<{ location: LocationData; weather: WeatherData }> => {
  const cacheKey = `${lat},${lon}`;
  const now = Date.now();

  // Check cache
  if (
    locationCache[cacheKey] &&
    now - locationCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    return {
      location: locationCache[cacheKey].location,
      weather: locationCache[cacheKey].weather || {
        temperature: 0,
        cloudCover: 0,
        visibility: 0,
      },
    };
  }

  try {
    // Fetch location and weather in parallel
    const [locationData, weatherData] = await Promise.all([
      reverseGeocode(lat, lon),
      fetchWeatherData(lat, lon),
    ]);

    const result = {
      location: locationData,
      weather: weatherData,
    };

    // Cache the result
    locationCache[cacheKey] = {
      ...result,
      timestamp: now,
      errorCount: 0,
    };

    return result;
  } catch (error) {
    console.error(`Error fetching data for ${lat},${lon}:`, error);
    throw error;
  }
};

const reverseGeocode = async (lat: number, lon: number, retryCount = 0): Promise<LocationData> => {
  const cacheKey = `${lat},${lon}`;
  const now = Date.now();

  // Check cache
  if (locationCache[cacheKey] && now - locationCache[cacheKey].timestamp < CACHE_DURATION) {
    console.debug('Cache hit:', cacheKey);
    return locationCache[cacheKey].location;
  }

  try {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    console.debug('Fetching location for:', { lat, lon });

    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.debug('Response data:', data);

    if (!Array.isArray(data) || !data.length) {
      throw new Error('Invalid response format');
    }

    const locationData: LocationData = {
      displayName: formatOpenWeatherLocation(data[0]),
      coordinates: [lat, lon] // Preserve original coordinates
    };

    // Cache successful result
    locationCache[cacheKey] = {
      location: locationData,
      timestamp: now,
      errorCount: 0
    };

    return locationData;

  } catch (error) {
    console.error(`Reverse geocoding failed for ${lat},${lon}:`, error);

    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * Math.pow(2, retryCount));
      return reverseGeocode(lat, lon, retryCount + 1);
    }

    // Fall back to coordinates
    const fallbackLocation: LocationData = {
      displayName: formatCoordinates(lat, lon),
      coordinates: [lat, lon]
    };

    locationCache[cacheKey] = {
      location: fallbackLocation,
      timestamp: now,
      errorCount: (locationCache[cacheKey]?.errorCount || 0) + 1
    };

    return fallbackLocation;
  }
};

interface OpenWeatherLocationData {
  name?: string;
  state?: string;
  country?: string;
  lat?: number;
  lon?: number;
}

const formatOpenWeatherLocation = (data: OpenWeatherLocationData): string => {
  const parts = [];
  
  if (data.name) parts.push(data.name);
  if (data.state) parts.push(data.state);
  if (data.country) parts.push(data.country);

  return parts.join(", ") || formatCoordinates(data.lat || 0, data.lon || 0);
};

interface GeocodeData {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    county?: string;
  };
  lat?: number;
  lon?: number;
}

const formatLocation = (data: GeocodeData): string => {
  if (!data?.address) return "";

  const parts = [];
  // Try different locality types
  const locality =
    data.address.city ||
    data.address.town ||
    data.address.village ||
    data.address.county;
  if (locality) parts.push(locality);
  if (data.address.state) parts.push(data.address.state);
  if (data.address.country) parts.push(data.address.country);

  return parts.join(", ") || formatCoordinates(data.lat || 0, data.lon || 0);
};

const formatCoordinates = (lat: number, lon: number): string => {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(1)}°${ns}, ${Math.abs(lon).toFixed(1)}°${ew}`;
};

async function processInBatches<T>(
  items: T[],
  batchSize: number,
  processFn: (item: T) => Promise<T>,
  delay: number
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    try {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map((item) => processFn(item))
      );

      results.push(
        ...batchResults.map((result, index) =>
          result.status === "fulfilled" ? result.value : batch[index]
        )
      );

      if (i + batchSize < items.length) {
        await sleep(delay);
      }
    } catch (error) {
      console.error(`Failed to process batch ${i}:`, error);
    }
  }

  return results;
}

interface PredictionListProps {
  spots: ViewingSpot[];
  onSpotClick: (spot: ViewingSpot) => void;
  selectedSpot: ViewingSpot | null;
  loading?: boolean;
  lastUpdated?: string | null;
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}
const PredictionList: React.FC<PredictionListProps> = ({
  spots,
  onSpotClick,
  selectedSpot,
  loading = false,
  lastUpdated,
  page,
  onPageChange,
  totalPages,
}) => {
  const theme = useTheme();
  const [loadingLocations, setLoadingLocations] = useState(false);
  const sortedSpots = [...spots].sort((a, b) => b.probability - a.probability);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const spot = sortedSpots[index];

    return (
      <Box
        key={spot.id}
        onClick={() => onSpotClick(spot)}
        sx={{
          cursor: "pointer",
          padding: "16px",
          backgroundColor:
            selectedSpot?.id === spot.id
              ? alpha(theme.palette.primary.main, 0.1)
              : "rgba(0, 0, 0, 0.4)",
          borderRadius: "4px",
          margin: "4px 6px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
          ...style,
        }}
      >
        {/* Coordinates/Location */}
        <Typography
          sx={{ color: "#fff", fontSize: "1rem", fontWeight: 500, mb: 0.5 }}
        >
          {spot.location ||
            formatCoordinates(spot.coordinates[0], spot.coordinates[1])}
        </Typography>

        

        {/* KP Index and Cloud Cover Row */}
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 1 }}>
          <Typography sx={{ color: "#64B5F6" }}>Kp {spot.kpIndex}</Typography>
          <Typography sx={{ color: "#bbb" }}>•</Typography>
          <Typography sx={{ color: "#bbb" }}>
            ☁️{" "}
            {typeof spot.cloudCover === "number" ? `${spot.cloudCover}%` : "0%"}
          </Typography>
        </Box>

        {/* Probability */}
        <Typography sx={{ color: "#81c784", mb: 0.5 }}>
          Probability: {spot.probability}%
        </Typography>

        {/* Visibility */}
        <Typography sx={{ color: "#90caf9", mb: 0.5 }}>
          Visibility:{" "}
          {typeof spot.visibility === "number" ? `${spot.visibility}%` : "0%"}
        </Typography>

        
      </Box>
    );
  };
  return (
    <Paper
      elevation={0}
      sx={{
        height: "70vh",
        bgcolor: "transparent",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          sx={{
            color: "#81c784",
            fontSize: "1.25rem",
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          Best Viewing Spots
        </Typography>

        {lastUpdated && (
          <Typography
            sx={{
              color: "#bbb",
              fontSize: "0.875rem",
            }}
          >
            Last updated: {format(new Date(lastUpdated), "MMM dd, yyyy HH:mm")}
          </Typography>
        )}
      </Box>

      {/* List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "hidden",
        }}
      >
        {spots.length > 0 ? (
          <Box
            sx={{
              height: "100%",
              overflowY: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <VirtualList
              height={450}
              width="100%"
              itemCount={sortedSpots.length}
              itemSize={140}
              overscanCount={5} // Add this to prevent flickering
              style={{ willChange: "transform" }} // Add this for better performance
            >
              {Row}
            </VirtualList>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "#bbb" }}>
            <Typography>No viewing spots available</Typography>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Pagination
            page={page}
            count={totalPages}
            onChange={(_, newPage) => onPageChange(newPage)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
                "&.Mui-selected": {
                  backgroundColor: "rgba(129, 199, 132, 0.2)",
                },
                "&:hover": {
                  backgroundColor: "rgba(129, 199, 132, 0.1)",
                },
              },
            }}
          />
        </Box>
      )}

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};

export default PredictionList;
