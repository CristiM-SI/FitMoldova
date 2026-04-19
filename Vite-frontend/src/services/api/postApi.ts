import axiosInstance from './axiosInstance';

export interface PostCreateDto {
    content: string;
    category: string;
    userId: number;
}

export interface PostReplyCreateDto {
    postId: number;
    content: string;
    userId: number;
}

const postApi = {
    getAll: () =>
        axiosInstance.get('/api/post'),

    getById: (id: number) =>
        axiosInstance.get(`/api/post/${id}`),

    getByUser: (userId: number) =>
        axiosInstance.get(`/api/post/user/${userId}`),

    create: (dto: PostCreateDto) =>
        axiosInstance.post('/api/post', dto),

    like: (postId: number, userId: number) =>
        axiosInstance.post(`/api/post/${postId}/like/${userId}`),

    addReply: (dto: PostReplyCreateDto) =>
        axiosInstance.post('/api/post/reply', dto),

    delete: (id: number) =>
        axiosInstance.delete(`/api/post/${id}`),
};

export default postApi;