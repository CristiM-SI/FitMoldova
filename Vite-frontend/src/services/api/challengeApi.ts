import axiosInstance from './axiosInstance';

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

function unwrap<T>(data: unknown): T {
    if (data && typeof data === 'object' && 'isSuccess' in data) {
        const env = data as { isSuccess: boolean; data: T; message?: string };
        if (!env.isSuccess) throw new Error(env.message ?? 'Eroare server');
        return env.data;
    }
    return data as T;
}

export const challengeApi = {
    getAll: () =>
        axiosInstance.get('/challenge').then((r) => unwrap<ChallengeDto[]>(r.data)),

    getById: (id: number) =>
        axiosInstance.get(`/challenge/${id}`).then((r) => unwrap<ChallengeDto>(r.data)),

    create: (payload: ChallengeCreatePayload) =>
        axiosInstance.post('/challenge', payload).then((r) => unwrap<ChallengeDto>(r.data)),

    update: (id: number, payload: ChallengeUpdatePayload) =>
        axiosInstance.put(`/challenge/${id}`, payload).then((r) => unwrap<ChallengeDto>(r.data)),

    // CRITICA NOUA 1 FIX: userId eliminat din URL — backend il extrage din JWT
    // Ruta noua: POST /api/challenge/{id}/join (fara /{userId})
    joinChallenge: (challengeId: number) =>
        axiosInstance.post(`/challenge/${challengeId}/join`).then(() => {}),

    // CRITICA NOUA 1 FIX: DELETE /api/challenge/{id}/leave (fara /{userId})
    leaveChallenge: (challengeId: number) =>
        axiosInstance.delete(`/challenge/${challengeId}/leave`).then(() => {}),

    delete: (id: number) =>
        axiosInstance.delete(`/challenge/${id}`).then(() => {}),
};
