import axios from 'axios';

export const BASE_URL = 'http://localhost:5296/api';

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
        const message: string =
            error.response?.data?.message ??
            error.message ??
            'Eroare server';
        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
