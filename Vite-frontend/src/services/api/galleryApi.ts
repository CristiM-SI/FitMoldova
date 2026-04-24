import axiosInstance, { BASE_URL } from './axiosInstance';

// ─────────────────── Types ─────────────────────────────────────────────
export interface GalleryInfoDto {
    id: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    imageUrl: string;          // e.g. "/uploads/gallery/abc123.webp"
    thumbnailUrl: string;      // e.g. "/uploads/gallery/thumbs/abc123_thumb.webp"
    fileSizeBytes: number;
    width: number;
    height: number;
    uploadedByUserId: number;
    createdAt: string;
    isPublished: boolean;
}

export interface GalleryCreatePayload {
    title: string;
    description: string;
    category: string;
    tags: string[];
    file: File;
}

export interface GalleryUpdateDto {
    title: string;
    description: string;
    category: string;
    tags: string[];
    isPublished: boolean;
}

export const GALLERY_CATEGORIES = [
    'Antrenament',
    'Competiții',
    'Nutriție',
    'Recuperare',
    'Evenimente',
    'Altele',
] as const;
export type GalleryCategory = typeof GALLERY_CATEGORIES[number];

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };
const unwrap = <T>(r: { data: ApiResponse<T> }): T => r.data.data;

/**
 * Convertește un URL relativ de la server (/uploads/gallery/...) într-un URL absolut
 * pe care browserul îl poate încărca.
 *
 * BASE_URL este "http://localhost:20111/api", deci facem strip la "/api" la final.
 */
export const resolveImageUrl = (relative: string): string => {
    if (!relative) return '';
    if (relative.startsWith('http')) return relative;
    const host = BASE_URL.replace(/\/api\/?$/, '');
    return `${host}${relative}`;
};

// ─────────────────── API calls ────────────────────────────────────────
const galleryApi = {
    /** GET /api/gallery — imaginile publicate (vizibile tuturor) */
    getAll: () =>
        axiosInstance.get<ApiResponse<GalleryInfoDto[]>>('/gallery').then(unwrap),

    /** GET /api/gallery/admin — toate imaginile inclusiv nepublicate (doar Admin) */
    getAllAdmin: () =>
        axiosInstance.get<ApiResponse<GalleryInfoDto[]>>('/gallery/admin').then(unwrap),

    /** GET /api/gallery/:id */
    getById: (id: number) =>
        axiosInstance.get<ApiResponse<GalleryInfoDto>>(`/gallery/${id}`).then(unwrap),

    /**
     * POST /api/gallery/upload — multipart/form-data (doar Admin)
     * Trimite fișierul + metadatele. Tag-urile sunt serializate ca JSON string
     * pentru că FormData nu suportă nativ array-uri.
     */
    upload: (payload: GalleryCreatePayload) => {
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('category', payload.category);
        formData.append('tags', JSON.stringify(payload.tags));

        return axiosInstance
            .post<ApiResponse<GalleryInfoDto>>('/gallery/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then(unwrap);
    },

    /** PUT /api/gallery/:id — update metadate (doar Admin) */
    update: (id: number, dto: GalleryUpdateDto) =>
        axiosInstance.put<ApiResponse<GalleryInfoDto>>(`/gallery/${id}`, dto).then(unwrap),

    /** PUT /api/gallery/:id/toggle-published — toggle vizibil/ascuns (doar Admin) */
    togglePublished: (id: number) =>
        axiosInstance.put<ApiResponse<GalleryInfoDto>>(`/gallery/${id}/toggle-published`).then(unwrap),

    /** DELETE /api/gallery/:id — șterge imagine + fișierele fizice (doar Admin) */
    delete: (id: number) =>
        axiosInstance.delete(`/gallery/${id}`),
};

export default galleryApi;
