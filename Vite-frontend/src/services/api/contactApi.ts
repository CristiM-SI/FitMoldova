import axiosInstance from './axiosInstance';
import type { ContactMessageCreateDto, ContactMessageInfoDto } from '../../types/Contact';

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

function unwrap<T>(res: { data: ApiResponse<T> }): T {
    return res.data.data;
}

const contactApi = {
    /** POST /api/contact — trimite mesaj de contact (public, fără auth) */
    submit: (dto: ContactMessageCreateDto) =>
        axiosInstance.post<ApiResponse<void>>('/contact', dto).then((r) => r.data),

    /** GET /api/contact — toate mesajele (doar admin) */
    getAll: () =>
        axiosInstance.get<ApiResponse<ContactMessageInfoDto[]>>('/contact').then(unwrap),

    /** PUT /api/contact/:id/read — marchează ca citit (doar admin) */
    markAsRead: (id: number) =>
        axiosInstance.put<ApiResponse<void>>(`/contact/${id}/read`).then(unwrap),

    /** DELETE /api/contact/:id — șterge mesaj (doar admin) */
    delete: (id: number) =>
        axiosInstance.delete(`/contact/${id}`),
};

export default contactApi;
