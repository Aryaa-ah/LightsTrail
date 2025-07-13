import express from 'express';
import aiRouter from '../controllers/aiController.js';

const router = express.Router();
router.use('/', aiRouter);

export default router;
