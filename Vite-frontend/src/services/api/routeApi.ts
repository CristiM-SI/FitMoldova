import axiosInstance from './axiosInstance';
import type { Traseu } from '../../types/Route';

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
    icon: string;
    bestSeason: string;
    highlights: string[];
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    path: { lat: number; lng: number }[];
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

function dtoToTraseu(dto: RouteDto): Traseu {
    return {
        id: dto.id,
        name: dto.name,
        type: dto.type as Traseu['type'],
        difficulty: dto.difficulty as Traseu['difficulty'],
        distance: dto.distance,
        estimatedDuration: dto.estimatedDuration,
        elevationGain: dto.elevationGain,
        description: dto.description,
        region: dto.region,
        surface: dto.surface as Traseu['surface'],
        isLoop: dto.isLoop,
        icon: dto.icon,
        bestSeason: dto.bestSeason,
        highlights: dto.highlights ?? [],
        startPoint: { lat: dto.startLat, lng: dto.startLng },
        endPoint: { lat: dto.endLat, lng: dto.endLng },
        path: dto.path ?? [],
    };
}

export const routeApi = {
    getAll: () =>
        axiosInstance.get('/route').then((r) => unwrap<RouteDto[]>(r.data).map(dtoToTraseu)),

    getById: (id: number) =>
        axiosInstance.get(`/route/${id}`).then((r) => unwrap<RouteDto>(r.data)),

    create: (payload: RouteCreatePayload) =>
        axiosInstance.post('/route', payload).then((r) => dtoToTraseu(unwrap<RouteDto>(r.data))),

    update: (id: number, payload: RouteUpdatePayload) =>
        axiosInstance.put(`/route/${id}`, payload).then((r) => dtoToTraseu(unwrap<RouteDto>(r.data))),

    delete: (id: number) =>
        axiosInstance.delete(`/route/${id}`).then(() => {}),
};
