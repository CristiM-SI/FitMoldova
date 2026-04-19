import axios from 'axios';

export const BASE_URL = 'http://localhost:20111/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token if stored in localStorage
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('fitmoldova_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Normalise error messages from the server
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // ← NOU: dacă tokenul expiră, delogăm automat
        if (error.response?.status === 401) {
            localStorage.removeItem('fitmoldova_token');
            localStorage.removeItem('fitmoldova_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        const message: string =
            error.response?.data?.message ??
            error.message ??
            'Eroare server';
        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
