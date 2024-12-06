// service/controllers/auroraPredictionController.js

import { setSuccess, setError } from "./response-handler.js";
import auroraPredictionService from "../services/auroraPredictionService.js";
import axios from "axios";

// Add default weather values
const DEFAULT_WEATHER = {
  temperature: 0,
  cloudCover: 50,
  visibility: 70,
  rating: 3.0
};

export const getPredictions = async (req, res) => {
  try {
    // Get predictions from NOAA data
    const predictions = await auroraPredictionService.generatePredictions();

    // Enrich with weather data
    const weatherEnrichedPredictions = await Promise.all(
      predictions.map(async (spot) => {
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                lat: spot.coordinates[0],
                lon: spot.coordinates[1],
                appid: process.env.OPENWEATHER_API_KEY,
                units: "metric",
              },
            }
          );

          // Calculate visibility based on clouds and time of day
          const cloudCover = weatherResponse.data.clouds.all;
          const isNight = weatherResponse.data.weather[0].icon.includes("n");
          const visibility = isNight
            ? 100 - cloudCover
            : Math.min(30, 100 - cloudCover);

          // Calculate rating based on multiple factors
          const rating = calculateRating(
            spot.probability,
            visibility,
            spot.kpIndex,
            spot.solarWindSpeed
          );

          return {
            ...spot,
            location: await getLocationName(
              spot.coordinates[0],
              spot.coordinates[1]
            ),
            temperature: weatherResponse.data.main.temp,
            cloudCover,
            visibility,
            rating,
            updatedAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error(
            `Error fetching weather data for spot ${spot.id}, using fallback data:`,
            error
          );
          
          // Return spot with fallback weather data
          return {
            ...spot,
            location: `${spot.coordinates[0].toFixed(2)}°N, ${spot.coordinates[1].toFixed(2)}°E`,
            temperature: DEFAULT_WEATHER.temperature,
            cloudCover: DEFAULT_WEATHER.cloudCover,
            visibility: DEFAULT_WEATHER.visibility,
            rating: calculateRating(
              spot.probability,
              DEFAULT_WEATHER.visibility,
              spot.kpIndex,
              spot.solarWindSpeed
            ),
            updatedAt: new Date().toISOString(),
          };
        }
      })
    );

    // Wrap response in expected format
    setSuccess({ 
      success: true,
      data: weatherEnrichedPredictions 
    }, res);
  } catch (error) {
    console.error("Error in getPredictions:", error);
    setError(error, res, 500);
  }
};

function calculateRating(probability, visibility, kpIndex, solarWindSpeed) {
  // Weight factors
  const weights = {
    probability: 0.4,
    visibility: 0.3,
    kpIndex: 0.2,
    solarWind: 0.1,
  };

  // Normalize values to 0-5 scale
  const normalizedProbability = (probability / 100) * 5;
  const normalizedVisibility = (visibility / 100) * 5;
  const normalizedKp = (kpIndex / 9) * 5;
  const normalizedWind = Math.min(((solarWindSpeed - 300) / 500) * 5, 5);

  // Calculate weighted average
  const rating =
    normalizedProbability * weights.probability +
    normalizedVisibility * weights.visibility +
    normalizedKp * weights.kpIndex +
    normalizedWind * weights.solarWind;

  return Math.round(rating * 10) / 10; // Round to 1 decimal place
}

async function getLocationName(lat, lon) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse`,
      {
        params: {
          lat,
          lon,
          limit: 1,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    if (response.data && response.data[0]) {
      const { name, country } = response.data[0];
      return `${name}, ${country}`;
    }

    return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
  } catch (error) {
    console.error("Error fetching location name:", error);
    return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
  }
}
