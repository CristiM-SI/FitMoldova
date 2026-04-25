import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const BASE_URL = 'http://localhost:20111/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Attach Bearer token if stored in localStorage
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('fitmoldova_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Refresh token state ---------------------------------------------------
// While a refresh is in flight, queue any other 401s and replay them once
// the new token arrives (or reject them all if refresh fails).
let isRefreshing = false;
let pendingQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const flushQueue = (error: unknown, token: string | null) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (token) resolve(token);
        else reject(error);
    });
    pendingQueue = [];
};

const forceLogout = () => {
    localStorage.removeItem('fitmoldova_token');
    localStorage.removeItem('fitmoldova_user');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

const requestNewToken = async (): Promise<string> => {
    // Bare axios call so we don't recurse through our own interceptors.
    const response = await axios.post<{ token: string; expiresAt?: string }>(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
    );
    const newToken = response.data?.token;
    if (!newToken) throw new Error('Token lipsă în răspunsul de refresh');
    localStorage.setItem('fitmoldova_token', newToken);
    return newToken;
};

// Normalise error messages from the server + auto refresh on 401
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableRequestConfig | undefined;
        const status = error.response?.status;

        const isRefreshCall =
            typeof originalRequest?.url === 'string' &&
            originalRequest.url.includes('/auth/refresh');

        if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Wait for the in-flight refresh, then replay this request.
                return new Promise((resolve, reject) => {
                    pendingQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers = originalRequest.headers ?? {};
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosInstance(originalRequest as AxiosRequestConfig) as Promise<AxiosResponse>);
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;
            try {
                const newToken = await requestNewToken();
                flushQueue(null, newToken);
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest as AxiosRequestConfig);
            } catch (refreshError) {
                flushQueue(refreshError, null);
                forceLogout();
                return Promise.reject(refreshError instanceof Error
                    ? refreshError
                    : new Error('Sesiune expirată'));
            } finally {
                isRefreshing = false;
            }
        }

        // 401 on the refresh call itself, or a retried request that still 401s.
        if (status === 401) {
            forceLogout();
        }

        const data = error.response?.data as { message?: string } | undefined;
        const message: string = data?.message ?? error.message ?? 'Eroare server';
        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
