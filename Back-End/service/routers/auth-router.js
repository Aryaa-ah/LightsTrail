import express from 'express';
import * as authController from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/signup', authController.signup); // User signup
router.post('/login', authController.login);   // User login

export default router;

