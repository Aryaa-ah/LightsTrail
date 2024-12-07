// Back-End/service/models/alertPreferences.js
import mongoose from "mongoose";

const alertPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kpThreshold: {
    type: Number,
    required: true,
    min: 0,
    max: 9,
    default: 5
  },
  email: {
    type: String,
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  lastNotificationSent: {
    type: Date,
    default: null
  },
  location: {
    latitude: Number,
    longitude: Number,
    cityName: String
  }
}, { timestamps: true });

const AlertPreferences = mongoose.model('AlertPreferences', alertPreferencesSchema);
export default AlertPreferences;