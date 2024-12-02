// Back-End/service/routers/auth-router.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as authController from '../controllers/auth-controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        await authController.signup(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
});

// Get current user route

router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const userData = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            provider: user.provider
        };
        
        // Only add avatar if it exists
        if (user.avatar) {
            userData.avatar = user.avatar;
        }
        
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Delete current user route
router.delete('/users/me', authenticateToken, async (req, res) => {
    try {
        await authController.deleteAccount(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete account', error: error.message });
    }
});

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'], 
        prompt: 'select_account' 
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/login?error=Authentication%20failed'
    }),
    async (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            const userData = {
                id: req.user._id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                provider: 'google',
                avatar: req.user.avatar
            };

            const encodedUserData = encodeURIComponent(JSON.stringify(userData));
            res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}&userData=${encodedUserData}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
        }
    }
);

export default router;