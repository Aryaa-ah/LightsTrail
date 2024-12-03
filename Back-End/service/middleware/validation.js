import { setError } from '../controllers/response-handler.js';

export const validateSignup = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    const errors = [];

    // Email validation
    if (!email) {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
        if (email.length > 50) {
            errors.push('Email must be less than 50 characters');
        }
    }

    // Password validation
    if (!password) {
        errors.push('Password is required');
    } else {
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }
        if (password.length > 50) {
            errors.push('Password must be less than 50 characters');
        }
    }

    // First Name validation
    if (!firstName) {
        errors.push('First name is required');
    } else {
        if (firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters');
        }
        if (firstName.length > 50) {
            errors.push('First name must be less than 50 characters');
        }
        if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
            errors.push('First name can only contain letters, spaces, hyphens and apostrophes');
        }
    }

    // Last Name validation
    if (!lastName) {
        errors.push('Last name is required');
    } else {
        if (lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters');
        }
        if (lastName.length > 50) {
            errors.push('Last name must be less than 50 characters');
        }
        if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
            errors.push('Last name can only contain letters, spaces, hyphens and apostrophes');
        }
    }

    if (errors.length > 0) {
        return setError({ message: 'Validation failed', errors }, res, 400);
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    // Email validation
    if (!email) {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    // Password validation
    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return setError({ message: 'Validation failed', errors }, res, 400);
    }

    next();
};