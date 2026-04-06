import axiosInstance from './axiosInstance';

export interface ActivityDto {
    id: number;
    name: string;
    type: string;
    distance: string;
    duration: string;
    calories: number;
    date: string;
    description: string;
    imageUrl: string;
    createdBy: string;
    participantsCount: number;
}

export interface ActivityCreatePayload {
    userId: number;
    name: string;
    type: string;
    distance: string;
    duration: string;
    calories: number;
    date: string;
    description: string;
    imageUrl: string;
}

function unwrap<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'isSuccess' in data) {
        const env = data as { isSuccess: boolean; data: T; message?: string };
        if (!env.isSuccess) throw new Error(env.message ?? 'Eroare server');
        return env.data;
    }
    return data as T;
}

export const activityApi = {
    getAll: () =>
        axiosInstance.get('/activity').then((r) => unwrap<ActivityDto[]>(r.data)),

    create: (payload: ActivityCreatePayload) =>
        axiosInstance.post('/activity', payload).then((r) => unwrap<ActivityDto>(r.data)),

    delete: (id: number) =>
        axiosInstance.delete(`/activity/${id}`).then(() => {}),
};
