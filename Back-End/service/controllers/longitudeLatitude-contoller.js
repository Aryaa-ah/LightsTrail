import * as longitudeLatitude from "./../services/longitudeLatitude-service.js";
import { setSuccess, setError } from "./../controllers/response-handler.js";

export const get = async (request, response) => {
    try {
        const { city } = request.params;

        if (!city) {
            return setError({ message: 'City Name is required' }, response, 400);
        }

        const matchingCities = await longitudeLatitude.fetchSuggestions(city);

        if (matchingCities.length > 0) {
            setSuccess({ suggestions: matchingCities }, response, 200);
        } else {
            setError({ message: 'Location not found' }, response, 404);
        }
    } catch (error) {
        if (error.message.includes('Service Unavailable')) {
            setError({ message: 'Service Unavailable' }, response, 503);
        } else {
            console.error('Error in controller:', error.message);
            setError({ message: 'Internal Server Error' }, response, 500);
        }
    }
};
