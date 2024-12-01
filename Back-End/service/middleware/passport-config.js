import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    prompt: 'select_account'
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Update existing user's Google ID if not set
            if (!user.googleId) {
                user.googleId = profile.id;
                user.provider = 'google';
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                googleId: profile.id,
                avatar: profile.photos?.[0]?.value,
                provider: 'google'
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export default passport;