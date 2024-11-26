import type { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';
import { Auth } from '../models/Auth';

class AuthService {
    private auth: Auth;
    private readonly API_BASE_URL = 'http://localhost:3003/auth';

    constructor() {
        this.auth = new Auth();
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
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
            
            this.auth.setAuthData(data);
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
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
            
            const data: AuthResponse = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }
            
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }

    logout(): void {
        this.auth.clearAuth();
    }

    isAuthenticated(): boolean {
        return this.auth.isAuthenticated();
    }

    getCurrentUser() {
        return this.auth.user;
    }
}

export const authService = new AuthService();