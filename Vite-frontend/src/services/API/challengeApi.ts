const BASE = 'http://localhost:5296/api/challenge';

export interface ChallengeDto {
    id: number;
    name: string;
    description: string;
    duration: string;
    difficulty: string;
    participants: number;
}

export interface ChallengeCreatePayload {
    name: string;
    description: string;
    duration: string;
    difficulty: string;
}

export interface ChallengeUpdatePayload extends ChallengeCreatePayload {}

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

export const challengeApi = {
    getAll: () => request<ChallengeDto[]>(BASE),

    getById: (id: number) => request<ChallengeDto>(`${BASE}/${id}`),

    create: (payload: ChallengeCreatePayload) =>
        request<ChallengeDto>(BASE, { method: 'POST', body: JSON.stringify(payload) }),

    update: (id: number, payload: ChallengeUpdatePayload) =>
        request<ChallengeDto>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

    joinChallenge: (challengeId: number, userId: number) =>
        request<void>(`${BASE}/${challengeId}/join/${userId}`, { method: 'POST' }),

    delete: (id: number) =>
        request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
};