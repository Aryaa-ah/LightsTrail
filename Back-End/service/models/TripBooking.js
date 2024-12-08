import mongoose from "mongoose";
const Trip = new mongoose.Schema({
    email: {
        type: String,
        
    },
    name: {
        type: String
    },
    destination: {
        type: String
    },
    date:{
        type: Date
    }

});

const TripBooking = mongoose.model("TripBooking", Trip);
export default TripBooking;