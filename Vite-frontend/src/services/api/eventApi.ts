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

    // CRITICA NOUA 1 FIX: userId eliminat din URL — backend il extrage din JWT
    join: (id: number) =>
        axiosInstance.post(`/event/${id}/join`).then(() => {}),

    // CRITICA NOUA 1 FIX: userId eliminat din URL
    leave: (id: number) =>
        axiosInstance.delete(`/event/${id}/leave`).then(() => {}),

    // isParticipant — backend extrage userId din token, fara parametru in URL
    isParticipant: (id: number) =>
        axiosInstance.get<{ isSuccess: boolean; data: boolean }>(`/event/${id}/isParticipant`)
            .then(r => r.data.data),

    delete: (id: number) =>
        axiosInstance.delete(`/event/${id}`).then(() => {}),
};
