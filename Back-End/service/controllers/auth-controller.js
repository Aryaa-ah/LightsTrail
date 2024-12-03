import authService from '../services/auth-service.js';
import { setSuccess, setError } from './response-handler.js';
import User from '../models/user.js';


export const signup = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        setSuccess({
            message: 'Registration successful',
            ...result
        }, res, 201);
    } catch (error) {
        const status = error.message.includes('already registered') ? 409 : 400;
        setError({ message: error.message }, res, status);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return setError({ message: 'Email and password are required' }, res, 400);
        }

        const result = await authService.login(req.body);
        setSuccess({
            message: 'Login successful',
            ...result
        }, res);
    } catch (error) {
        setError({ message: error.message }, res, 401);
    }
};


// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return setError({ message: 'Not authenticated' }, res, 401);
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return setError({ message: 'User not found' }, res, 404);
        }

        setSuccess({ user }, res);
    } catch (error) {
        setError({ message: error.message }, res, 500);
    }
};


// Delete user account




export const deleteAccount = async (req, res) => {
    try {
        if (!req.user) {
            return setError({ message: 'Not authenticated' }, res, 401);
        }

        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return setError({ 
                message: "User doesn't exist" 
            }, res, 404);
        }

        await User.findByIdAndDelete(userId);
        
        setSuccess({ 
            success: true,
            message: "Account successfully deleted"
        }, res, 200);
    } catch (error) {
        setError({ 
            message: 'Failed to delete account'
        }, res, 500);
    }
};