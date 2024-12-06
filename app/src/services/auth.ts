export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    provider: 'local' | 'google';
}

class AuthService {
    private tokenKey = 'token';
    private userKey = 'user';

    isAuthenticated(): boolean {
        const token = localStorage.getItem(this.tokenKey);
        const user = localStorage.getItem(this.userKey);
        return Boolean(token && user);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(this.userKey);
        if (!userStr) return null;
        
        try {
            return JSON.parse(userStr);
        } catch {
            this.logout(); // Clear invalid data
            return null;
        }
    }

    async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
        try {
            const response = await fetch('http://localhost:3002/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include' // Important for cookies
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            this.setSession(data.token, data.user);
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Login failed');
        }
    }

    async signup(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<{ user: User; token: string }> {
        try {
            const response = await fetch('http://localhost:3002/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Signup failed');
            }

            const data = await response.json();
            this.setSession(data.token, data.user);
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Signup failed');
        }
    }

    handleGoogleAuthSuccess(token: string, userData: string): void {
        try {
            const user = JSON.parse(decodeURIComponent(userData));
            this.setSession(token, user);
        } catch (error) {
            console.error('Error processing Google auth data:', error);
            throw new Error('Failed to process authentication data');
        }
    }

    private setSession(token: string, user: User): void {
        try {
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem(this.userKey, JSON.stringify(user));
        } catch (error) {
            console.error('Error setting session:', error);
            this.clearSession();
            throw new Error('Failed to save authentication data');
        }
    }

    private clearSession(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    logout(): void {
        this.clearSession();
        // Optional: Call backend to invalidate token
        fetch('http://localhost:3002/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            },
            credentials: 'include'
        }).finally(() => {
            window.location.href = 'auth/login';
        });
    }

    // Refresh token functionality if needed
    async refreshToken(): Promise<string | null> {
        try {
            const response = await fetch('http://localhost:3002/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to refresh token');

            const { token } = await response.json();
            localStorage.setItem(this.tokenKey, token);
            return token;
        } catch (error) {
            this.logout();
            return null;
        }
    }

     // Delete user details
     // Update the deleteAccount method in your auth service
async deleteAccount(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3002/auth/users/me', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete account');
        }

        this.clearSession();
    } catch (error) {
        throw error;
    }
}
}



export const authService = new AuthService();