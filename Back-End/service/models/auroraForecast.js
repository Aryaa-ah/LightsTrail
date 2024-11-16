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