import longitudeLatitudeModel from "./../models/longitudeLatitude.js";
import axios from 'axios';

export const fetch = async (cityName) => {
    const { city } = cityName;

    // Validate input
    if (!city) {
        throw new Error("Enter City Name");
    }

    try {
        // API call with await
        const apiUrl = `https://geocode.xyz/${city}?json=1`;
        const response = await axios.get(apiUrl);

        //console.log(response);
        //Create longitudeLatitudeModel object
        const longiLatitude = new longitudeLatitudeModel({
            longitude: response.data.longt,
            latitude: response.data.latt
        });
        const longitudeLatitudeObject = longiLatitude.toObject();
        delete longitudeLatitudeObject._id;
        return longitudeLatitudeObject; 
    } catch (error) {
      throw error; 
    }
};
