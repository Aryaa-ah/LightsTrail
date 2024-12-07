// alertRouter.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as alertController from '../controllers/alertController.js';

const router = express.Router();

router.route('/preferences')
  .get(authenticateToken, alertController.getAlertPreference)
  .post(authenticateToken, alertController.createAlertPreference)
  .put(authenticateToken, alertController.updateAlertPreference);

export default router;