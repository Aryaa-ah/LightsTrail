// Back-End/service/scheduler.js
import schedule from 'node-schedule';
import { checkAndSendAlerts } from './controllers/alertController.js';

const initScheduler = () => {
  // Run every 30 minutes
  schedule.scheduleJob('*/30 * * * *', async () => {
    console.log('Running scheduled aurora alert check...');
    try {
      await checkAndSendAlerts();
    } catch (error) {
      console.error('Error in scheduled alert check:', error);
    }
  });
};

export default initScheduler;