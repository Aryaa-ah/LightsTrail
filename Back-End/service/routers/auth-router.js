import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

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
            
            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
        }
    }
);

export default router;