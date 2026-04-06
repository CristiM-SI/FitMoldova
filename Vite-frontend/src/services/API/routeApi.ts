// src/services/api/routeApi.ts
// Toate apelurile HTTP catre backend pentru entitatea Route

const BASE = 'http://localhost:5296/api/route';

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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (res.status === 204) return null as T;
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? 'Eroare server');
    if (json && typeof json === 'object' && 'data' in json) return json.data as T;
    return json as T;
}

export const routeApi = {
    getAll: () =>
        request<RouteDto[]>(BASE),

    getById: (id: number) =>
        request<RouteDto>(`${BASE}/${id}`),

    create: (payload: RouteCreatePayload) =>
        request<RouteDto>(BASE, {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    update: (id: number, payload: RouteUpdatePayload) =>
        request<RouteDto>(`${BASE}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        }),

    delete: (id: number) =>
        request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
};