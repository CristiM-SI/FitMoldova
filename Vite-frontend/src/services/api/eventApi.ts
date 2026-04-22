import axiosInstance from './axiosInstance';

export interface EventDto {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    city: string;
    category: string;
    participants: number;
    maxParticipants: number;
    price: string;
    organizer: string;
    difficulty: string;
    imageUrl: string;
}

export interface EventCreatePayload {
    name: string;
    description: string;
    date: string;
    location: string;
    city: string;
    category: string;
    maxParticipants: number;
    price: string;
    organizer: string;
    difficulty: string;
    imageUrl: string;
}

export interface EventUpdatePayload extends EventCreatePayload {}

// Unwrap { isSuccess, data } envelope returned by the backend
function unwrap<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'isSuccess' in data) {
        const env = data as { isSuccess: boolean; data: T; message?: string };
        if (!env.isSuccess) throw new Error(env.message ?? 'Eroare server');
        return env.data;
    }
    return data as T;
}

export const eventApi = {
    getAll: () =>
        axiosInstance.get('/event').then((r) => unwrap<EventDto[]>(r.data)),

    getById: (id: number) =>
        axiosInstance.get(`/event/${id}`).then((r) => unwrap<EventDto>(r.data)),

    create: (payload: EventCreatePayload) =>
        axiosInstance.post('/event', payload).then((r) => unwrap<EventDto>(r.data)),

    update: (id: number, payload: EventUpdatePayload) =>
        axiosInstance.put(`/event/${id}`, payload).then((r) => unwrap<EventDto>(r.data)),

    join: (id: number, userId: number) =>
        axiosInstance.post(`/event/${id}/join/${userId}`).then(() => {}),

    leave: (id: number, userId: number) =>
        axiosInstance.delete(`/event/${id}/leave/${userId}`).then(() => {}),

    delete: (id: number) =>
        axiosInstance.delete(`/event/${id}`).then(() => {}),
};
