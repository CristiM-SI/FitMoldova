import axiosInstance from './axiosInstance';

export interface ClubDto {
    id: number;
    name: string;
    category: string;
    location: string;
    description: string;
    schedule: string;
    level: string;
    rating: number;
    members: number;
}

export interface ClubCreatePayload {
    name: string;
    category: string;
    location: string;
    description: string;
    schedule: string;
    level: string;
}

export interface ClubUpdatePayload extends ClubCreatePayload {
    rating: number;
}

function unwrap<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'isSuccess' in data) {
        const env = data as { isSuccess: boolean; data: T; message?: string };
        if (!env.isSuccess) throw new Error(env.message ?? 'Eroare server');
        return env.data;
    }
    return data as T;
}

export const clubApi = {
    getAll: () =>
        axiosInstance.get('/club').then((r) => unwrap<ClubDto[]>(r.data)),

    getById: (id: number) =>
        axiosInstance.get(`/club/${id}`).then((r) => unwrap<ClubDto>(r.data)),

    create: (payload: ClubCreatePayload) =>
        axiosInstance.post('/club', payload).then((r) => unwrap<ClubDto>(r.data)),

    update: (id: number, payload: ClubUpdatePayload) =>
        axiosInstance.put(`/club/${id}`, payload).then((r) => unwrap<ClubDto>(r.data)),

    joinClub: (clubId: number, userId: number) =>
        axiosInstance.post(`/club/${clubId}/join/${userId}`).then(() => {}),

    delete: (id: number) =>
        axiosInstance.delete(`/club/${id}`).then(() => {}),
};
