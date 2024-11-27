import type { User, LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

export class Auth {
    user: User | null = null;
    token: string | null = null;

    constructor() {
        // Initialize from localStorage if available
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken) this.token = storedToken;
        if (storedUser) this.user = JSON.parse(storedUser);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    setAuthData(response: AuthResponse): void {
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('authToken', response.token);
        }
        if (response.user) {
            this.user = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
        }
    }

    clearAuth(): void {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
}