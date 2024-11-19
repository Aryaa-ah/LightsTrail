import mongoose from "mongoose";

const LongitudeLatitudeSchema = new mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId, // MongoDB default _id field
    city_country: {
        type: String,
        required: true
    },
    latitude: {
        type: Number, // Double in MongoDB
        // required: true
    },
    longitude: {
        type: Number, // Double in MongoDB
        // required: true
    }
});

// Add an index on `city_country` for faster searching
LongitudeLatitudeSchema.index({ city_country: 1 });

const LongitudeLatitudeModel = mongoose.model('cities', LongitudeLatitudeSchema);// name in DB - cities
export default LongitudeLatitudeModel;
