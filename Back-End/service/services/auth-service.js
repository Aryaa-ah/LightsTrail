import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

// user registration
export const register = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const user = new User(userData);
    return user.save();
};

// user authentication  

export const authenticate = async (credentials) => {
    const user = await User.findOne({ email: credentials.email });
    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {   // compare the hashed password
        throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, user };
};
