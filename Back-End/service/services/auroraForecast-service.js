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

        // Create AuroraForecast object
        const forecast = new AuroraForecast({
            kpIndex: response.data.ace.kp,
            bz: response.data.ace.bz,
            speed: response.data.ace.speed,
            longitude: parseFloat(response.data.probability.long),
            latitude: parseFloat(response.data.probability.lat)
        });
        const forecastObject = forecast.toObject();
        delete forecastObject._id;
        return forecastObject; 
    } catch (error) {
        
        throw error; 
    }
};
