import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth-controller.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';
import authService from '../services/auth-service.js';
import { authenticateToken } from '../middleware/auth.js';



const router = express.Router();

// Local auth routes with validation
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);



// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'] 
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/login?error=Authentication%20failed'
    }),
    async (req, res) => {
        try {
            const result = await authService.handleGoogleAuth(req.user);
            const params = new URLSearchParams({
                token: result.token,
                user: JSON.stringify(result.user)
            });
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?${params}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication%20failed`);
        }
    }
);

// delete user account
// router.delete('/', authenticateToken, authController.deleteAccount);


router.delete('/users/me', authenticateToken, authController.deleteAccount);




export default router;