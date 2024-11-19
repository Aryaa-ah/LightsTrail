import longitudeLatitudeModel from "./../models/longitudeLatitude.js";
import axios from "axios";

export const fetch = async (cityName) => {
    const { city } = cityName;

    if (!city) {
        throw new Error("Enter City Name");
    }

    try {
        // API call
        const apiUrl = `https://geocode.xyz/${city}?json=1`;
        const response = await axios.get(apiUrl);

        // Check if the API response indicates a missing or invalid city
        if (response.data.error || !response.data.longt || !response.data.latt) {
            return {}; // Return an empty object if city not found
        }

        // Create longitudeLatitudeModel object
        const longiLatitude = new longitudeLatitudeModel({
            longitude: parseFloat(response.data.longt),
            latitude: parseFloat(response.data.latt),
        });

        const longitudeLatitudeObject = longiLatitude.toObject();
        delete longitudeLatitudeObject._id;
        return longitudeLatitudeObject;
    } catch (error) {
        if (error.response && error.response.status === 503) {
            throw new Error("Service Unavailable");
        }
        throw error; // Re-throw for other unexpected errors
    }
};
