// src/services/auth.ts
import { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

class AuthService {
    private readonly API_BASE_URL = 'http://localhost:3002/auth';

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
            localStorage.setItem('user', JSON.stringify(data.user));
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
        // Store current URL to return to after auth
        localStorage.setItem('returnTo', window.location.pathname);
        // Redirect to Google auth endpoint
        window.location.href = `${this.API_BASE_URL}/google`;
    }

    handleGoogleAuthSuccess(token: string) {
        localStorage.setItem('authToken', token);
        // Get return URL or default to home
        const returnTo = localStorage.getItem('returnTo') || '/home';
        localStorage.removeItem('returnTo'); // Clean up
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