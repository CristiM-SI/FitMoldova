import axiosInstance from './axiosInstance';

export interface LoginResponse {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string; // "User" | "Moderator" | "Admin"
    registeredAt: string;
}

export interface RegisterResponse {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    registeredAt: string;
}

export interface ServiceResponse<T = unknown> {
    isSuccess: boolean;
    message?: string;
    data?: T;
}

export const userApi = {
    login: (username: string, password: string) =>
        axiosInstance
            .post<ServiceResponse<LoginResponse>>('/user/login', { username, password })
            .then((r) => r.data),

    register: (firstName: string, lastName: string, email: string, password: string) =>
        axiosInstance
            .post<ServiceResponse<RegisterResponse>>('/user/register', { firstName, lastName, email, password })
            .then((r) => r.data),

    getById: (id: number) =>
        axiosInstance
            .get<ServiceResponse<LoginResponse>>(`/user/${id}`)
            .then((r) => r.data),

    update: (id: number, firstName: string, lastName: string, email: string) =>
        axiosInstance
            .put<ServiceResponse<void>>(`/user/${id}`, { firstName, lastName, email })
            .then((r) => r.data),

    delete: (id: number) =>
        axiosInstance.delete(`/user/${id}`).then(() => {}),
};
