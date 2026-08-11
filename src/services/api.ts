import axios from 'axios';
import { USER_KEY } from './authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://www.theforgeoftokens.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.token && config.headers) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error('Erro ao processar token para requisição', e);
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(USER_KEY);
            window.location.href = '/entrar';
        }
        return Promise.reject(error);
    }
);

export default api;