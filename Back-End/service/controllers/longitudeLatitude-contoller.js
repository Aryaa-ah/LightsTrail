import * as longitudeLatitude from "./../services/longitudeLatitude-service.js";
import { setSuccess, setError } from "./response-handler.js";

export const get = async (request, response) => {
    try {
        const { city } = request.params;

        if (!city) {
            return setError({ message: "City Name is required" }, response, 400);
        }

        const longitudeLatitudeReturned = await longitudeLatitude.fetch({ city });

        // Check if the service returned no results
        if (Object.keys(longitudeLatitudeReturned).length === 0) {
            return setError({ message: "City Name not found" }, response, 404);
        }

        // Successful response
        return setSuccess(longitudeLatitudeReturned, response);
    } catch (error) {
        // Handle Service Unavailable explicitly
        if (error.message === "Service Unavailable") {
            return setError({ message: "Service Unavailable" }, response, 503);
        }

        // General error handling for unexpected issues
        return setError({ message: error.message }, response, 500);
    }
};
