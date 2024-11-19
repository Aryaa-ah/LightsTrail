// import * as authService from './../services/auth-service.js';
// import { setSuccess, setError } from './response-handler.js';

// export const signup = async (request, response) => {
//     try {
//         const newUser = { ...request.body };
//         const user = await authService.register(newUser);
//         setSuccess(user, response);
//     } catch (error) {
//         setError(error, response);
//     }
// };

// export const login = async (request, response) => {
//     try {
//         const credentials = { ...request.body };
//         const user = await authService.authenticate(credentials);
//         setSuccess(user, response);
//     } catch (error) {
//         setError(error, response);
//     }
// };



import * as authService from '../services/auth-service.js';
import { setSuccess, setError } from './response-handler.js';



export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Input validation
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

export const login = async (req, res) => {
    try {
        const { token, user } = await authService.authenticate(req.body);
        setSuccess({ message: 'Login successful', token, user }, res);
    } catch (error) {
        setError(error, res);
    }
};