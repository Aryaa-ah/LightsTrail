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
    max: 9
  },
  email: {
    type: String,
    required: true
  },
  location: {
    cityName: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  isEnabled: {
    type: Boolean,
    default: true
  },
  lastNotificationSent: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('AlertPreference', alertPreferencesSchema);