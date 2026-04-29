import api from './api';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types';

export const USER_KEY = 'tokenforge_user';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    },

    async register(userData: RegisterData): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/register', userData);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    },

    async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/google', { token: googleToken });
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    },

    async verifyEmail(email: string, code: string): Promise<void> {
        await api.post('/auth/verify-email', { email, code });
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    },

    logout(): void {
        localStorage.removeItem(USER_KEY);
    },
};