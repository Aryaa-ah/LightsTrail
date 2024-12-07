// controllers/alertController.js

import AlertPreferences from '../models/alertPreferences.js';
import { setSuccess, setError } from './response-handler.js';
import emailService from '../services/emailService.js';
import { call as fetchAuroraData } from '../services/auroraForecast-service.js';


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
        location, // Single location
        isEnabled
      });
  
      await alertPref.save();
      //changed to check imidiatly after creation
      await checkPreference(alertPref);

      setSuccess(alertPref, res, 201);
    } catch (error) {
      setError(error, res);
    }
  };

export const getAlertPreference = async (req, res) => {
    try {
        const userId = req.user.id;
        const alertPref = await AlertPreferences.findOne({ userId });
        
        if (!alertPref) {
            return setError({ message: 'Alert preferences not found' }, res, 404);
        }

        setSuccess({ data: alertPref }, res);
    } catch (error) {
        setError({ message: error.message }, res, 500);
    }
};

export const updateAlertPreference = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const alertPref = await AlertPreferences.findOneAndUpdate(
            { userId },
            { 
                ...updates,
                lastNotificationSent: null // Reset when preferences are updated
            },
            { new: true, runValidators: true }
        );

        if (!alertPref) {
            return setError({ message: 'Alert preferences not found' }, res, 404);
        }
        // changed to check immediately after update
        await checkPreference(alertPref);
        setSuccess({ 
            message: 'Alert preferences updated successfully',
            data: alertPref 
        }, res);
    } catch (error) {
        setError({ message: error.message }, res, 500);
    }
};
// for test purpose only 
export const sendTestAlert = async (req, res) => {
    try {
        const userId = req.user.id;
        const alertPref = await AlertPreferences.findOne({ userId });

        if (!alertPref) {
            return setError({ message: 'Alert preferences not found' }, res, 404);
        }

        await emailService.sendTestEmail(alertPref.email);
        
        setSuccess({ 
            message: 'Test email sent successfully' 
        }, res);
    } catch (error) {
        setError({ message: error.message }, res, 500);
    }
};

export const checkAndSendAlerts = async () => {
  try {
    const alertPrefs = await AlertPreferences.find({ isEnabled: true });
    console.log('Found active preferences:', alertPrefs);

    for (const pref of alertPrefs) {
      if (!pref.location) {
        console.log('Skipping preference with no location:', pref._id);
        continue;
      }

      console.log('Checking alerts for location:', pref.location);

      const auroraData = await fetchAuroraData({
        latitude: pref.location.latitude,
        longitude: pref.location.longitude
      });

      console.log('Aurora data received:', auroraData);

      if (parseFloat(auroraData.kpIndex) >= pref.kpThreshold) {
        console.log('KP threshold exceeded, sending alert');
        
        await emailService.sendKpAlert(pref.email, {
          kpIndex: auroraData.kpIndex,
          location: pref.location.cityName,
          probability: auroraData.probability
        });

        // Update last notification sent time
        pref.lastNotificationSent = new Date();
        await pref.save();
        
        console.log('Alert sent and timestamp updated');
      } else {
        console.log('KP threshold not exceeded');
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};


// function for checking single preference
const checkPreference = async (preference) => {
    try {
        if (!preference.isEnabled) {
            console.log('Preference not enabled, skipping check');
            return;
        }

        const auroraData = await fetchAuroraData({
            latitude: preference.location.latitude,
            longitude: preference.location.longitude
        });

        const currentKpIndex = parseFloat(auroraData.kpIndex);
        console.log(`Initial check - KP Index ${currentKpIndex} vs threshold ${preference.kpThreshold}`);

        if (currentKpIndex >= preference.kpThreshold) {
            await emailService.sendKpAlert(preference.email, {
                kpIndex: currentKpIndex,
                location: preference.location.cityName,
                probability: auroraData.probability || '0'
            });
        }
    } catch (error) {
        console.error('Error in initial preference check:', error);
    }
};

// Helper function to determine if notification should be sent
const shouldSendNotification = async (pref, currentKpIndex) => {
    if (!pref.lastNotificationSent) return true;
    
    const hoursSinceLastNotification = 
        (new Date() - new Date(pref.lastNotificationSent)) / (1000 * 60 * 60);
    
    // Don't send more than one notification every 4 hours
    return hoursSinceLastNotification >= 4 && currentKpIndex >= pref.kpThreshold;
};

// Helper function to calculate probability based on KP index
const calculateProbability = (kpIndex) => {
    return Math.min(Math.round((kpIndex / 9) * 100), 100);
};