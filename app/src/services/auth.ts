import type { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

class AuthService {
    private readonly API_BASE_URL = 'http://localhost:3002/auth';

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store auth data
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // After signup, automatically log in
            return this.login({
                email: credentials.email,
                password: credentials.password
            });
        } catch (error) {
            throw error;
        }
    }

    handleGoogleLogin() {
        window.location.href = `${this.API_BASE_URL}/google`;
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
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