// src/services/auth.ts
import { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

class AuthService {
    private readonly API_BASE_URL = 'http://localhost:3002/auth';

    // In services/auth.ts
async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    
    const data: AuthResponse = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    
    if (data.token) {
        localStorage.setItem('authToken', data.token);
        if (data.user) {
            console.log('Storing user data:', data.user); // Debug log
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        window.location.href = '/home';
    }
    
    return data;
}

    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        const response = await fetch(`${this.API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        const data: AuthResponse = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
    
        // Instead of auto-login, redirect to login page
        window.location.href = '/login';
        return data;
    }

    
    handleGoogleLogin() {
        // Stores current URL to return to after auth
        localStorage.setItem('returnTo', window.location.pathname);
        // Redirect to Google auth endpoint
        window.location.href = `${this.API_BASE_URL}/google`;
    }

    handleGoogleAuthSuccess(token: string) {
        const params = new URLSearchParams(window.location.search);
        const userDataStr = params.get('userData');
        
        localStorage.setItem('authToken', token);
        
        if (userDataStr) {
            try {
                const userData = JSON.parse(decodeURIComponent(userDataStr));
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        const returnTo = localStorage.getItem('returnTo') || '/home';
        localStorage.removeItem('returnTo');
        window.location.href = returnTo;
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }
   

    
}

export const authService = new AuthService();