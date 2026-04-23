import axiosInstance from './axiosInstance';
import type { FeedbackCreateDto, FeedbackInfoDto, FeedbackStatsDto } from '../../types/Feedback';

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

function unwrap<T>(res: { data: ApiResponse<T> }): T {
    return res.data.data;
}

const feedbackApi = {
    /** POST /api/feedback — trimite feedback (utilizator autentificat) */
    submit: (dto: FeedbackCreateDto) =>
        axiosInstance.post<ApiResponse<number>>('/feedback', dto).then(unwrap),

    /** GET /api/feedback — recenzii vizibile (public, folosit în pagina Feedback) */
    getAll: () =>
        axiosInstance.get<ApiResponse<FeedbackInfoDto[]>>('/feedback').then(unwrap),

    /** GET /api/feedback/admin — toate recenziile inclusiv ascunse (doar admin) */
    getAllAdmin: () =>
        axiosInstance.get<ApiResponse<FeedbackInfoDto[]>>('/feedback/admin').then(unwrap),

    /** GET /api/feedback/stats — statistici globale (rating mediu, distribuție) */
    getStats: () =>
        axiosInstance.get<ApiResponse<FeedbackStatsDto>>('/feedback/stats').then(unwrap),

    /** PUT /api/feedback/:id/status — schimbă vizibilitate (doar admin) */
    updateStatus: (id: number, status: 'vizibil' | 'ascuns') =>
        axiosInstance.put<ApiResponse<void>>(`/feedback/${id}/status`, { status }).then(unwrap),

    /** PUT /api/feedback/:id/pin — toggle pin (doar admin) */
    togglePin: (id: number) =>
        axiosInstance.put<ApiResponse<void>>(`/feedback/${id}/pin`).then(unwrap),

    /** DELETE /api/feedback/:id — șterge recenzie (doar admin) */
    delete: (id: number) =>
        axiosInstance.delete(`/feedback/${id}`),
};

export default feedbackApi;
