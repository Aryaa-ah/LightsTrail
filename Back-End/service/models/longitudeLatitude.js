import mongoose from "mongoose";

const LongitudeLatitudeSchema = new mongoose.Schema({
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
});

const longitudeLatitudeModel = mongoose.model('LongitudeLatitude', LongitudeLatitudeSchema);
export default longitudeLatitudeModel;