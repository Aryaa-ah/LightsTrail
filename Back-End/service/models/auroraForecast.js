import mongoose from "mongoose";

const AuroraForecastSchema = new mongoose.Schema({
    kpIndex: {
        type: String,
        
    },
    bz: {
        type: String,
        
    },
    speed: {
        type: String,
        
    },
    temperature: {
        type: String
    },
    precipitation: {
        type: String
    },
    windSpeed: {
        type: String
    },
    uvIndex: {
        type: String
    },
    cloudCover: {
        type: String
    },
    isDay: {
        type: String
    },
    probability: {
        type: String
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
});

const AuroraForecast = mongoose.model('AuroraForecast', AuroraForecastSchema);
export default AuroraForecast;