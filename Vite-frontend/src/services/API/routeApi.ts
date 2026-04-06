import axiosInstance from './axiosInstance';

export interface RouteDto {
    id: number;
    name: string;
    type: string;
    difficulty: string;
    distance: number;
    estimatedDuration: number;
    elevationGain: number;
    description: string;
    region: string;
    surface: string;
    isLoop: boolean;
}

export interface RouteCreatePayload {
    name: string;
    type: string;
    difficulty: string;
    distance: number;
    estimatedDuration: number;
    elevationGain: number;
    description: string;
    region: string;
    surface: string;
    isLoop: boolean;
}

export interface RouteUpdatePayload extends RouteCreatePayload {}

function unwrap<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'isSuccess' in data) {
        const env = data as { isSuccess: boolean; data: T; message?: string };
        if (!env.isSuccess) throw new Error(env.message ?? 'Eroare server');
        return env.data;
    }
    return data as T;
}

export const routeApi = {
    getAll: () =>
        axiosInstance.get('/route').then((r) => unwrap<RouteDto[]>(r.data)),

    getById: (id: number) =>
        axiosInstance.get(`/route/${id}`).then((r) => unwrap<RouteDto>(r.data)),

    create: (payload: RouteCreatePayload) =>
        axiosInstance.post('/route', payload).then((r) => unwrap<RouteDto>(r.data)),

    update: (id: number, payload: RouteUpdatePayload) =>
        axiosInstance.put(`/route/${id}`, payload).then((r) => unwrap<RouteDto>(r.data)),

    delete: (id: number) =>
        axiosInstance.delete(`/route/${id}`).then(() => {}),
};
