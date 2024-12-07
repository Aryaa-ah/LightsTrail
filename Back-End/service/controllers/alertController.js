// Back-End/service/controllers/alertController.js
import AlertPreferences from '../models/alertPreferences.js';
import { setSuccess, setError } from './response-handler.js';
import emailService from '../services/emailService.js';

// alertController.js
export const createAlertPreference = async (req, res) => {
    try {
      const { kpThreshold, email, location, isEnabled } = req.body;
      const userId = req.user.id;
  
      // Validate location
      if (!location || !location.latitude || !location.longitude || !location.cityName) {
        return setError({ message: 'Valid location is required' }, res, 400);
      }
  
      const alertPref = new AlertPreferences({
        userId,
        kpThreshold,
        email,
        location,
        isEnabled
      });
  
      await alertPref.save();
      setSuccess(alertPref, res, 201);
    } catch (error) {
      setError(error, res);
    }
  };
  
  export const updateAlertPreference = async (req, res) => {
    try {
      const { kpThreshold, location, isEnabled } = req.body;
      const userId = req.user.id;
  
      // Validate location if provided
      if (location && (!location.latitude || !location.longitude || !location.cityName)) {
        return setError({ message: 'Valid location is required' }, res, 400);
      }
  
      const updateData = {
        kpThreshold,
        isEnabled,
        ...(location && { location })
      };
  
      const alertPref = await AlertPreferences.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true }
      );
  
      if (!alertPref) {
        return setError({ message: 'Alert preferences not found' }, res, 404);
      }
  
      setSuccess(alertPref, res);
    } catch (error) {
      setError(error, res);
    }
  };

export const getAlertPreference = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('Getting preferences for user:', userId);
      
      const alertPref = await AlertPreferences.findOne({ userId });
      
      // Add default preferences if none exist
      if (!alertPref) {
        const defaultPreferences = new AlertPreferences({
          userId,
          kpThreshold: 5,
          email: req.user.email, // Make sure you have email in user object
          isEnabled: true,
          location: null
        });
        
        await defaultPreferences.save();
        return setSuccess(defaultPreferences, res);
      }
  
      setSuccess(alertPref, res);
    } catch (error) {
      console.error('Error in getAlertPreference:', error);
      setError(error, res);
    }
  };

export const checkAndSendAlerts = async (kpIndex, location) => {
  try {
    const alertPrefs = await AlertPreferences.find({ 
      isEnabled: true,
      kpThreshold: { $lte: kpIndex }
    });

    for (const pref of alertPrefs) {
      const shouldSendAlert = await shouldSendNotification(pref, kpIndex);
      if (shouldSendAlert) {
        await emailService.sendKpAlert(pref.email, {
          kpIndex,
          location: location || pref.location.cityName,
          probability: calculateProbability(kpIndex)
        });
        
        pref.lastNotificationSent = new Date();
        await pref.save();
      }
    }
  } catch (error) {
    console.error('Error sending alerts:', error);
  }
};

const shouldSendNotification = async (pref, currentKpIndex) => {
  if (!pref.lastNotificationSent) return true;
  
  const hoursSinceLastNotification = 
    (new Date() - pref.lastNotificationSent) / (1000 * 60 * 60);
  
  return hoursSinceLastNotification >= 4 && currentKpIndex >= pref.kpThreshold;
};

const calculateProbability = (kpIndex) => {
  // Simple probability calculation based on Kp Index
  return Math.min(Math.round((kpIndex / 9) * 100), 100) + '%';
};