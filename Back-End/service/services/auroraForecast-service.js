import AuroraForecast from "./../models/auroraForecast.js";
import axios from 'axios';

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
              current: 'temperature_2m,precipitation,wind_speed_10m',
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
            
            uvIndex: Math.max(...uv)

        });
        
        const forecastObject = forecast.toObject();
        delete forecastObject._id;
        return forecastObject; 
    } catch (error) {
        console.log(error)
        throw error; 
    }
};
