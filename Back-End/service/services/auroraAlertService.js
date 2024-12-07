// Back-End/service/services/auroraAlertService.js

import AlertPreferences from '../models/alertPreferences.js';
import emailService from './emailService.js';
import { call as fetchAuroraData } from './auroraForecast-service.js';

export const checkAndSendAlerts = async () => {
  try {
    const alertPrefs = await AlertPreferences.find({ isEnabled: true });
    console.log(`Found ${alertPrefs.length} active preferences`);

    for (const pref of alertPrefs) {
      try {
        if (!pref.location?.latitude || !pref.location?.longitude) {
          console.log(`Skipping alert check - invalid location for user ${pref.email}`);
          continue;
        }

        const auroraData = await fetchAuroraData({
          latitude: pref.location.latitude,
          longitude: pref.location.longitude
        });

        const currentKpIndex = parseFloat(auroraData.kpIndex);
        console.log(`KP Index ${currentKpIndex} vs threshold ${pref.kpThreshold} for ${pref.email}`);

        if (currentKpIndex >= pref.kpThreshold) {
          // Add check for last notification
          const shouldNotify = await shouldSendNotification(pref, currentKpIndex);
          
          if (shouldNotify) {
            try {
              await emailService.sendKpAlert(pref.email, {
                kpIndex: currentKpIndex,
                location: pref.location.cityName,
                probability: auroraData.probability || '0'
              });

              pref.lastNotificationSent = new Date();
              await pref.save();
              console.log(`Alert sent to ${pref.email}`);
            } catch (emailError) {
              console.error('Failed to send email:', emailError);
            }
          } else {
            console.log(`Skipping notification for ${pref.email} - too recent`);
          }
        }
      } catch (prefError) {
        console.error(`Error processing alert for ${pref.email}:`, prefError);
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};


// Helper function to prevent notification spam
const shouldSendNotification = async (pref, currentKpIndex) => {
  // If no previous notification, should send
  if (!pref.lastNotificationSent) {
    console.log('No previous notification found, should send alert');
    return true;
  }
  
  const hoursSinceLastNotification = 
    (new Date() - new Date(pref.lastNotificationSent)) / (1000 * 60 * 60);
  
  // Don't send more than one notification every 4 hours
  const shouldSend = hoursSinceLastNotification >= 4 && currentKpIndex >= pref.kpThreshold;
  console.log(`Hours since last notification: ${hoursSinceLastNotification.toFixed(2)}, Should send: ${shouldSend}`);
  
  return shouldSend;
};