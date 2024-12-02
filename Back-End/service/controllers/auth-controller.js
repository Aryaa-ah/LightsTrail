// import * as authService from './../services/auth-service.js';
// import { setSuccess, setError } from './response-handler.js';

import * as authService from '../services/auth-service.js';
import { setSuccess, setError } from './response-handler.js';


// user registration

export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });   
    }

    try {
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'User successfully registered', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// user authentication
export const login = async (req, res) => {
    try {
        const { token, user } = await authService.authenticate(req.body);
        setSuccess({ message: 'Login successful', token, user }, res);
    } catch (error) {
        setError(error, res);
    }
};

export const deleteAccount = async (req, res) => {
    try {
        await authService.deleteUser(req.user.id); // req.user comes from the JWT token
        res.json({ 
            success: true, 
            message: 'Account successfully deleted' 
        });
    } catch (error) {
        setError(error, res);
    }
};