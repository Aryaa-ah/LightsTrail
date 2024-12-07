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
} from "@mui/material";
import { ViewingSpot } from "../types/auroraPred.types";
import ViewingSpotCard from "./ViewingSpots";
import { format } from "date-fns";

// Enhanced cache interface with error tracking
interface LocationCache {
  [key: string]: {
    location: string;
    timestamp: number;
    errorCount?: number;
  };
}

const locationCache: LocationCache = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const BATCH_SIZE = 3; // Reduced batch size
const DELAY_BETWEEN_REQUESTS = 1500; // Increased delay between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const ERROR_CACHE_DURATION = 30 * 60 * 1000; // Cache errors for 30 minutes

// Enhanced sleep function with jitter
const sleep = async (ms: number) => {
  const jitter = Math.random() * 500; // Add random delay up to 500ms
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
};

const reverseGeocode = async (
  lat: number,
  lon: number,
  retryCount = 0
): Promise<string> => {
  const cacheKey = `${lat},${lon}`;
  const now = Date.now();

  // Check cache, including error cache
  if (locationCache[cacheKey]) {
    const cached = locationCache[cacheKey];
    if (cached.errorCount && now - cached.timestamp < ERROR_CACHE_DURATION) {
      return formatCoordinates(lat, lon); // Use coordinates if recently errored
    }
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.location;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
        new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
          format: "json",
          zoom: "10",
          "accept-language": "en",
        }),
      {
        headers: {
          "User-Agent": "LightsTrail Aurora Viewer v1.0",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let location = formatLocation(data);

    // Cache successful result
    locationCache[cacheKey] = {
      location,
      timestamp: now,
      errorCount: 0,
    };

    return location;
  } catch (error) {
    console.warn(`Reverse geocoding failed for ${lat},${lon}:`, error);

    // Retry logic with exponential backoff
    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * Math.pow(2, retryCount));
      return reverseGeocode(lat, lon, retryCount + 1);
    }

    // Cache the error state
    locationCache[cacheKey] = {
      location: formatCoordinates(lat, lon),
      timestamp: now,
      errorCount: (locationCache[cacheKey]?.errorCount || 0) + 1,
    };

    return formatCoordinates(lat, lon);
  }
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
}

const PredictionList: React.FC<PredictionListProps> = ({
  spots,
  onSpotClick,
  selectedSpot,
  loading = false,
  lastUpdated,
}) => {
  const theme = useTheme();
  const [enrichedSpots, setEnrichedSpots] = useState(spots);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    let mounted = true;

    const enrichSpots = async () => {
      if (!spots.length) return;

      setLoadingLocations(true);
      try {
        const processSpot = async (spot: ViewingSpot): Promise<ViewingSpot> => {
          if (spot.location && spot.location.includes(",")) {
            return spot; // Skip if already has formatted location
          }
          const location = await reverseGeocode(
            spot.coordinates[0],
            spot.coordinates[1]
          );
          return { ...spot, location };
        };

        const enrichedData = await processInBatches(
          spots,
          BATCH_SIZE,
          processSpot,
          DELAY_BETWEEN_REQUESTS
        );

        if (mounted) {
          setEnrichedSpots(enrichedData);
        }
      } catch (error) {
        console.error("Failed to enrich spots with locations:", error);
        if (mounted) {
          setEnrichedSpots(spots);
        }
      } finally {
        if (mounted) {
          setLoadingLocations(false);
        }
      }
    };

    enrichSpots();

    return () => {
      mounted = false;
    };
  }, [spots]);

  const sortedSpots = React.useMemo(
    () => [...enrichedSpots].sort((a, b) => b.probability - a.probability),
    [enrichedSpots]
  );

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        height: "70vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            background: "linear-gradient(45deg, #84fab0 10%, #8fd3f4 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Best Viewing Spots
        </Typography>
        {(loading || loadingLocations) && <CircularProgress size={20} />}
      </Box>

      {lastUpdated && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          Last updated: {format(new Date(lastUpdated), "MMM dd, yyyy HH:mm")}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          flex: 1,
          scrollbarWidth: "thin",
          scrollbarColor: `${alpha(theme.palette.primary.main, 0.2)} ${alpha(
            theme.palette.background.paper,
            0.1
          )}`,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: alpha(theme.palette.background.paper, 0.1),
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(theme.palette.primary.main, 0.2),
            borderRadius: "4px",
            "&:hover": {
              background: alpha(theme.palette.primary.main, 0.3),
            },
          },
        }}
      >
        {sortedSpots.map((spot) => (
          <Box
            key={spot.id}
            onClick={() => onSpotClick(spot)}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              bgcolor:
                selectedSpot?.id === spot.id
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
              borderRadius: 1,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                transform: "translateY(-2px)",
              },
            }}
          >
            <ViewingSpotCard
              spot={spot}
              expanded={selectedSpot?.id === spot.id}
            />
            {spot !== sortedSpots[sortedSpots.length - 1] && (
              <Divider
                sx={{ mt: 2, borderColor: alpha(theme.palette.divider, 0.1) }}
              />
            )}
          </Box>
        ))}

        {spots.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            <Typography>No viewing spots available</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PredictionList;
