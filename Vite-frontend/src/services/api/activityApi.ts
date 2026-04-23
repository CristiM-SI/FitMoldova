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

export interface ActivityUpdatePayload {
    name: string;
    type: string;
    distance: string;
    duration: string;
    calories: number;
    date: string;
    description: string;
    imageUrl: string;
}

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

function unwrap<T>(res: { data: ApiResponse<T> | T }): T {
    const body = res.data as ApiResponse<T>;
    if (body && typeof body === 'object' && 'isSuccess' in body) {
        if (!body.isSuccess) throw new Error(body.message ?? 'Eroare server');
        return body.data;
    }
    return body as unknown as T;
}

/**
 * Normalizează payload-ul înainte de trimitere:
 * - asigură format ISO 8601 complet pentru `date` (cu secunde), altfel
 *   System.Text.Json din .NET poate refuza "2026-04-17T10:00" fără secunde.
 */
function normalizePayload<T extends { date?: string }>(payload: T): T {
    if (!payload.date) return payload;
    const d = payload.date;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(d)) {
        return { ...payload, date: `${d}:00` };
    }
    return payload;
}

export const activityApi = {
    getAll: () =>
        axiosInstance.get<ApiResponse<ActivityDto[]>>('/activity').then(unwrap),

    getById: (id: number) =>
        axiosInstance.get<ApiResponse<ActivityDto>>(`/activity/${id}`).then(unwrap),

    create: (payload: ActivityCreatePayload) =>
        axiosInstance.post<ApiResponse<number>>('/activity', normalizePayload(payload)).then(unwrap),

    update: (id: number, payload: ActivityUpdatePayload) =>
        axiosInstance.put<ApiResponse<number>>(`/activity/${id}`, normalizePayload(payload)).then(unwrap),

    delete: (id: number) =>
        axiosInstance.delete(`/activity/${id}`).then(() => {}),

    join: (activityId: number, userId: number) =>
        axiosInstance.post(`/activity/${activityId}/join/${userId}`).then(() => {}),

    getParticipants: (activityId: number) =>
        axiosInstance
            .get<ApiResponse<Array<{ id: number; username: string; joinedAt: string }>>>(
                `/activity/${activityId}/participants`
            )
            .then(unwrap),
};
