import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, UpdateProfileData } from '@/types';

export const USER_KEY = 'tokenforge_user';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    },

    async register(userData: RegisterData): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/register', userData);
        return data;
    },

    async loginWithGoogle(idToken: string): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/google', { id_token: idToken });
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    },

    async verifyEmail(email: string, code: string): Promise<void> {
        await api.post('/auth/verify-email', { email, code });
    },

    async resendVerificationCode(email: string): Promise<void> {
        await api.post('/auth/resend-verification', { email });
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(token: string, newPassword: string): Promise<void> {
        await api.post('/auth/reset-password', { token, new_password: newPassword });
    },

    async updateProfile(payload: UpdateProfileData): Promise<AuthResponse> {
        const body: Record<string, string> = { username: payload.username };
        if (payload.newPassword) {
            body.current_password = payload.currentPassword ?? '';
            body.new_password = payload.newPassword;
        }
        const { data } = await api.put<AuthResponse>('/auth/profile', body);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
        return data;
    },

    logout(): void {
        localStorage.removeItem(USER_KEY);
    },
};