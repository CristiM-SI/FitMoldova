import axiosInstance from './axiosInstance';

export interface PostCreateDto {
    userId: number;
    content: string;
    sport: string;
}

export interface PostReplyCreateDto {
    postId: number;
    userId: number;
    content: string;
}

export interface PostInfoDto {
    id: number;
    userId: number;
    authorName: string;
    authorUsername: string;
    content: string;
    sport: string;
    likes: number;
    commentsCount: number;
    createdAt: string;
}

export interface ReplyDto {
    id: number;
    userId: number;
    authorName: string;
    content: string;
    createdAt: string;
}

export interface PostWithRepliesDto extends PostInfoDto {
    replies: ReplyDto[];
}

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

function unwrap<T>(res: { data: ApiResponse<T> }): T {
    return res.data.data;
}

const postApi = {
    getAll: () =>
        axiosInstance.get<ApiResponse<PostInfoDto[]>>('/post').then(unwrap),

    getById: (id: number) =>
        axiosInstance.get<ApiResponse<PostWithRepliesDto>>(`/post/${id}`).then(unwrap),

    getByUser: (userId: number) =>
        axiosInstance.get<ApiResponse<PostInfoDto[]>>(`/post/user/${userId}`).then(unwrap),

    create: (dto: PostCreateDto) =>
        axiosInstance.post<ApiResponse<number>>('/post', dto).then(unwrap),

    // CRITICA NOUA 2 FIX: userId eliminat din URL — backend il extrage din JWT
    // Ruta noua: POST /api/post/{id}/like (fara /{userId})
    like: (postId: number) =>
        axiosInstance.post<ApiResponse<number>>(`/post/${postId}/like`).then(unwrap),

    addReply: (dto: PostReplyCreateDto) =>
        axiosInstance.post<ApiResponse<number>>('/post/reply', dto).then(unwrap),

    delete: (id: number) =>
        axiosInstance.delete(`/post/${id}`),
};

export default postApi;
