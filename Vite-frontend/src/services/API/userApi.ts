import axiosInstance from './axiosInstance';

export interface LoginResponse {
    id: number;
    username: string;
    email: string;
    role: string; // "User" | "Moderator" | "Admin"
}

export interface RegisterResponse {
    id: number;
}

export interface ServiceResponse<T = unknown> {
    isSuccess: boolean;
    message?: string;
    data?: T;
}

export const userApi = {
    login: (credential: string, password: string) =>
        axiosInstance
            .post<ServiceResponse<LoginResponse>>('/user/login', { credential, password })
            .then((r) => r.data),

    register: (username: string, email: string, password: string) =>
        axiosInstance
            .post<ServiceResponse<RegisterResponse>>('/user/register', { username, email, password })
            .then((r) => r.data),

    getById: (id: number) =>
        axiosInstance
            .get<ServiceResponse<LoginResponse>>(`/user/${id}`)
            .then((r) => r.data),
};
