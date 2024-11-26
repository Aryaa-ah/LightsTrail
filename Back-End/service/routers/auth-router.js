// import express from 'express';
// import * as authController from '../controllers/auth-controller.js';

// const router = express.Router();

// router.post('/signup', authController.signup); // User signup
// router.post('/login', authController.login);   // User login

// export default router;


import express from 'express';
import passport from '../middleware/passport-config.js';
import * as authController from '../controllers/auth-controller.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Existing routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false 
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/auth?error=1'
    }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.redirect(`http://localhost:5173/auth/google/success?token=${token}`);
    }
);

export default router;