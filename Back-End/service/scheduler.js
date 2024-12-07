
import schedule from 'node-schedule';
import { checkAndSendAlerts } from './controllers/alertController.js';

const initScheduler = () => {

  
    // Runs every 30 minutes to check for alerts
    schedule.scheduleJob('*/30 * * * *', async () => {
      console.log('Running aurora alert check...');
      try {
        await checkAndSendAlerts();
      } catch (error) {
        console.error('Error in alert check:', error);
      }
    });


  // Optional: Runs for immediate check on startup
  setTimeout(async () => {
    console.log('Running initial aurora alert check...');
    try {
      await checkAndSendAlerts();
    } catch (error) {
      console.error('Error in initial alert check:', error);
    }
  }, 5000); // Wait 5 seconds after startup
};

export default initScheduler;