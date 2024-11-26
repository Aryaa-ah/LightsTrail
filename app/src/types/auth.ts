export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
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
}