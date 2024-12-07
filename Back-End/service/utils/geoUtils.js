// Back-End/service/utils/geoUtils.js

const EARTH_RADIUS = 6371;

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function isWithinRadius(lat1, lon1, lat2, lon2, radiusKm) {
  return calculateDistance(lat1, lon1, lat2, lon2) <= radiusKm;
}

export function findNearestPoint(lat, lon, points) {
  let nearest = null;
  let minDistance = Infinity;

  for (const point of points) {
    const distance = calculateDistance(lat, lon, point.lat, point.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...point, distance };
    }
  }

  return nearest;
}
