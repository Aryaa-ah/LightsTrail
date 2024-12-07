// routes/alertRouter.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    createAlertPreference,
    getAlertPreference,
    updateAlertPreference,
    sendTestAlert
} from '../controllers/alertController.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/preferences', createAlertPreference);
router.get('/preferences', getAlertPreference);
router.put('/preferences', updateAlertPreference);
router.post('/test-email', sendTestAlert);

export default router;