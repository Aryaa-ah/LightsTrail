// auroraAlertService.js
import AlertPreferences from '../models/alertPreferences.js';
import emailService from './emailService.js';
import { fetchAuroraData } from './auroraForecast-service.js';

export const checkAndSendAlerts = async () => {
  try {
    // Get all enabled alert preferences
    const alertPrefs = await AlertPreferences.find({ isEnabled: true });

    for (const pref of alertPrefs) {
      if (!pref.location) continue;

      // Fetch aurora data for user's location
      const auroraData = await fetchAuroraData({
        latitude: pref.location.latitude,
        longitude: pref.location.longitude
      });

      // Check if conditions meet the user's threshold
      if (parseFloat(auroraData.kpIndex) >= pref.kpThreshold) {
        // Check if we should send notification (avoid spam)
        const shouldNotify = await shouldSendNotification(pref);
        
        if (shouldNotify) {
          await emailService.sendKpAlert(pref.email, {
            kpIndex: auroraData.kpIndex,
            location: pref.location.cityName,
            probability: auroraData.probability
          });

          // Update last notification time
          pref.lastNotificationSent = new Date();
          await pref.save();
        }
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};

// Helper to determine if we should send a new notification
const shouldSendNotification = async (pref) => {
  if (!pref.lastNotificationSent) return true;
  
  // Don't send more than one notification every 4 hours
  const hoursSinceLastNotification = 
    (new Date() - new Date(pref.lastNotificationSent)) / (1000 * 60 * 60);
  
  return hoursSinceLastNotification >= 4;
};