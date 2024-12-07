// src/services/auroraUtils.ts

export const GEO_CONSTANTS = {
  EARTH_RADIUS: 6371, // km
  MIN_KP: 0,
  MAX_KP: 9,
  MIN_SOLAR_WIND: 300, // km/s
  MAX_SOLAR_WIND: 800, // km/s
  OPTIMAL_BZ: -5, // nT (negative values are better for aurora)
};

// Haversine distance calculation
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * GEO_CONSTANTS.EARTH_RADIUS;
}

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

// Enhanced probability calculation
export function calculateAuroraProbability(
  baseProbability: number,
  latitude: number,
  kpIndex: number,
  solarWindSpeed: number,
  bzComponent: number,
  cloudCover: number
): number {
  let probability = baseProbability;

  // KP Index influence (exponential boost for higher values)
  const kpFactor = Math.exp(kpIndex / GEO_CONSTANTS.MAX_KP) - 1;
  probability *= (1 + kpFactor);

  // Solar wind influence
  const normalizedWind = (solarWindSpeed - GEO_CONSTANTS.MIN_SOLAR_WIND) / 
    (GEO_CONSTANTS.MAX_SOLAR_WIND - GEO_CONSTANTS.MIN_SOLAR_WIND);
  probability *= (1 + normalizedWind);

  // Magnetic field (Bz) influence
  if (bzComponent < 0) {
    const bzBoost = Math.min(Math.abs(bzComponent / GEO_CONSTANTS.OPTIMAL_BZ), 2);
    probability *= (1 + bzBoost);
  }

  // Cloud cover reduction
  probability *= (1 - cloudCover / 100);

  return Math.min(100, Math.max(0, probability));
}