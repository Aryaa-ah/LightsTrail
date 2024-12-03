import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

class AuthService {
    async register(userData) {
        const { email, password, firstName, lastName } = userData;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName
        });

        await user.save();
        const token = this.generateToken(user);

        return { token, user: this.sanitizeUser(user) };
    }

    async login(credentials) {
        const { email, password } = credentials;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        return { token, user: this.sanitizeUser(user) };
    }

    async handleGoogleAuth(profile) {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = await User.create({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                googleId: profile.id,
                provider: 'google'
            });
        }

        const token = this.generateToken(user);
        return { token, user: this.sanitizeUser(user) };
    }

    generateToken(user) {
        return jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    sanitizeUser(user) {
        return {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            provider: user.provider
        };
    }
}

export default new AuthService();