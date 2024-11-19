import LongitudeLatitudeModel from "./../models/LongitudeLatitude.js";

export const fetchSuggestions = async (partialCity) => {
    try {
        // Use case-insensitive regex for matching
        console.log(partialCity);
        const regex = new RegExp(`^${partialCity.trim()}`, 'i');
        const suggestions = await LongitudeLatitudeModel.find(
            { city_country: { $regex: regex } },
            { city_country: 1, latitude: 1, longitude: 1 , _id: 0} // Include only required fields
        ).limit(10); // Limit to 10 suggestions
        return suggestions;
    } catch (error) {
        console.error('Error during fetchSuggestions:', error.message);

        // Throw appropriate error for higher-level handlers
        if (error.name === 'MongoNetworkError') {
            throw new Error('Service Unavailable');
        }

        throw new Error('Internal Server Error');
    }
};

