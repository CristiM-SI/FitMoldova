import axiosInstance from './axiosInstance';
import type { NotificationInfoDto } from '../../types/Notification';

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

function unwrap<T>(res: { data: ApiResponse<T> }): T {
    return res.data.data;
}

const notificationApi = {
    /** GET /api/notification — notificările utilizatorului autentificat */
    getAll: () =>
        axiosInstance
            .get<ApiResponse<NotificationInfoDto[]>>('/notification')
            .then(unwrap),

    /** GET /api/notification/unread-count — numărul de necitite */
    getUnreadCount: () =>
        axiosInstance
            .get<ApiResponse<number>>('/notification/unread-count')
            .then(unwrap),

    /** PATCH /api/notification/:id/read — marchează o notificare ca citită */
    markAsRead: (id: number) =>
        axiosInstance
            .patch<ApiResponse<void>>(`/notification/${id}/read`)
            .then((r) => r.data),

    /** PATCH /api/notification/read-all — marchează toate ca citite */
    markAllAsRead: () =>
        axiosInstance
            .patch<ApiResponse<void>>('/notification/read-all')
            .then((r) => r.data),

    /** DELETE /api/notification/:id — șterge o notificare */
    delete: (id: number) =>
        axiosInstance.delete(`/notification/${id}`),
};

export default notificationApi;
