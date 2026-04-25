import axiosInstance from './axiosInstance';

export interface ClubDto {
    id: number;
    name: string;
    category: string;
    location: string;
    description: string;
    schedule: string;
    level: string;
    rating: number;
    imageUrl: string;
    membersCount: number;
}

export interface ClubCreatePayload {
    name: string;
    category: string;
    location: string;
    description: string;
    schedule: string;
    level: string;
    imageUrl: string;
}

export interface ClubUpdatePayload extends ClubCreatePayload {
    rating: number;
}

export interface ClubMemberDto {
    id: number;
    username: string;
    joinedAt: string;
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

export const clubApi = {
    getAll: () =>
        axiosInstance.get<ApiResponse<ClubDto[]>>('/club').then(unwrap),

    getById: (id: number) =>
        axiosInstance.get<ApiResponse<ClubDto>>(`/club/${id}`).then(unwrap),

    create: (payload: ClubCreatePayload) =>
        axiosInstance.post<ApiResponse<ClubDto>>('/club', payload).then(unwrap),

    update: (id: number, payload: ClubUpdatePayload) =>
        axiosInstance.put<ApiResponse<ClubDto>>(`/club/${id}`, payload).then(unwrap),

    /** POST /api/club/{clubId}/join — CRITICA NOUA 1 FIX: userId din token, nu din URL */
    joinClub: (clubId: number) =>
        axiosInstance.post(`/club/${clubId}/join`).then(() => {}),

    /** DELETE /api/club/{clubId}/leave — CRITICA NOUA 1 FIX: userId din token, nu din URL */
    leaveClub: (clubId: number) =>
        axiosInstance.delete(`/club/${clubId}/leave`).then(() => {}),

    getMembers: (clubId: number) =>
        axiosInstance.get<ApiResponse<ClubMemberDto[]>>(`/club/${clubId}/members`).then(unwrap),

    getUserClubs: (userId: number) =>
        axiosInstance.get<ApiResponse<ClubDto[]>>(`/club/user/${userId}`).then(unwrap),

    delete: (id: number) =>
        axiosInstance.delete(`/club/${id}`).then(() => {}),
};
