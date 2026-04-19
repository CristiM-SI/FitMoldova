import axiosInstance from './axiosInstance';

export interface LoginResponse {
    token: string;
    expiresAt: string;
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string; // "User" | "Moderator" | "Admin"
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

export interface UserProfile {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string | null;
    location: string | null;
    bio: string | null;
    profileImageUrl: string | null;
    createdAt: string;
}

export interface AdminUserDto {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface ServiceResponse<T = unknown> {
    isSuccess: boolean;
    message?: string;
    data?: T;
}

export const userApi = {
    login: (username: string, password: string) =>
        axiosInstance
            .post<LoginResponse>('/user/login', { username, password })
            .then((r) => r.data),

    register: (firstName: string, lastName: string, email: string, password: string) =>
        axiosInstance
            .post<ServiceResponse<RegisterResponse>>('/user/register', { firstName, lastName, email, password })
            .then((r) => r.data),

    getById: (id: number) =>
        axiosInstance
            .get<ServiceResponse<UserProfile>>(`/user/${id}`)
            .then((r) => r.data),

    update: (id: number, data: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        location?: string;
        bio?: string;
    }) =>
        axiosInstance
            .put<ServiceResponse<void>>(`/user/${id}`, data)
            .then((r) => r.data),

    delete: (id: number) =>
        axiosInstance.delete(`/user/${id}`).then(() => {}),

    getAll: () =>
        axiosInstance
            .get<ServiceResponse<AdminUserDto[]>>('/user')
            .then((r) => r.data.data ?? []),

    changeRole: (id: number, role: string) =>
        axiosInstance
            .patch<ServiceResponse<void>>(`/user/${id}/role`, { role })
            .then((r) => r.data),

    changeStatus: (id: number, isActive: boolean) =>
        axiosInstance
            .patch<ServiceResponse<void>>(`/user/${id}/status`, { isActive })
            .then((r) => r.data),
};
