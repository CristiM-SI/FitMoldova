const BASE = 'http://localhost:5296/api/activity';

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

export const activityApi = {
    getAll: () => request<ActivityDto[]>(BASE),

    create: (payload: ActivityCreatePayload) =>
        request<ActivityDto>(BASE, {
            method: 'POST',
            body: JSON.stringify(payload),
        }),

    delete: (id: number) =>
        request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
};