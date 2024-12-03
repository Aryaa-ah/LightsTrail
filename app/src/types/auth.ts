export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    firstName: string;
    lastName: string;
}

export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
}

export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    provider?: 'local' | 'google';
}