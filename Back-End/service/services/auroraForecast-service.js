import AuroraForecast from "./../models/auroraForecast.js";
import { checkAndSendAlerts } from '../controllers/alertController.js';

import axios from 'axios';
const calculateAuroraPrediction = (data) => {
  // Extract values from the data object
  const kp = parseFloat(data.kpIndex);
  const bz = parseFloat(data.bz);
  const speed = parseFloat(data.speed);
  const temperature = parseFloat(data.temperature);
  const precipitation = parseFloat(data.precipitation);
  const windSpeed = parseFloat(data.windSpeed);
  const uvIndex = parseFloat(data.uvIndex);
  const cloudCover = parseFloat(data.cloudCover);
  const isDay = data.isDay; // "Day" or "Night"

  // Initialize probability variable
  let probability = 0;

  // Apply logic to calculate probability based on the input parameters
  if (kp >= 5 && bz < 0) {
    probability += 40; // High KP and negative Bz increase the probability of auroras
  }

  if (speed > 400 && temperature < -10) {
    probability += 30; // High speed and low temperature are favorable conditions for auroras
  }

  if (precipitation < 10 && windSpeed > 10) {
    probability += 20; // Low precipitation and high wind speed might indicate clear skies
  }

  if (uvIndex > 6) {
    probability += 10; // High UV index could indicate increased solar activity
  }

  if (cloudCover > 50) {
    probability -= 20; // High cloud cover reduces visibility of auroras
  }

  // Adjust for time of day
  if (isDay === "Day") {
    probability = 0; // Auroras are not visible during the day
  } else if (isDay === "Night") {
    probability += 10; // Nighttime slightly increases visibility chances
  }

  // Ensure probability is within the range of 0 to 100
  probability = Math.max(0, Math.min(100, probability));

  return probability;
};


export const call = async (forecastData) => {
    const { latitude, longitude } = forecastData;

    // Validate input
    if (!latitude || !longitude) {
        throw new Error("Invalid latitude or longitude");
    }

    try {
        // API call with await
        const apiUrl = `https://api.auroras.live/v1/?type=all&lat=${latitude}&long=${longitude}&forecast=false&threeday=false`;
        const response = await axios.get(apiUrl);
        
        const options = {
            method: 'GET',
            url: 'https://api.open-meteo.com/v1/forecast',
            params: {
              latitude: latitude,
              longitude: longitude,
              current: 'temperature_2m,precipitation,wind_speed_10m,cloud_cover,is_day',
              daily: 'uv_index_max',
              forecast_days: '1'
            }
          };
          const  weatherData  = await axios.request(options);
          console.log(weatherData);
          const uv = weatherData.data.daily.uv_index_max? weatherData.data.daily.uv_index_max : [0];
        // Create AuroraForecast object
        const forecast = new AuroraForecast({
            kpIndex: response.data.ace.kp,
            bz: response.data.ace.bz,
            speed: response.data.ace.speed,
            longitude: parseFloat(response.data.probability.long),
            latitude: parseFloat(response.data.probability.lat),
            temperature: weatherData.data.current.temperature_2m+" "+weatherData.data.current_units.temperature_2m,
            precipitation: weatherData.data.current.precipitation+" "+weatherData.data.current_units.precipitation,
            windSpeed: weatherData.data.current.wind_speed_10m+" "+weatherData.data.current_units.wind_speed_10m,
            cloudCover: weatherData.data.current.cloud_cover+""+weatherData.data.current_units.cloud_cover,
            isDay: weatherData.data.current.is_day==0?"Night":"Day",
            probability:"",
            uvIndex: Math.max(...uv)

        });
        forecast.probability=calculateAuroraPrediction(forecast)+"%";
        console.log("weatherData.data.current.isDay"+weatherData.data.current.isDay);
        const forecastObject = forecast.toObject();
        delete forecastObject._id;
    
        return forecastObject; 
    } catch (error) {
        console.log(error)
        throw error; 
    }
};
