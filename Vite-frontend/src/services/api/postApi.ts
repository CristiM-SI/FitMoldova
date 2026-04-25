import axiosInstance from './axiosInstance';

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface PostCreateDto {
    userId: number;
    content: string;
    sport: string;
    clubId?: number;
}

export interface PostUpdateDto {
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
    clubId?: number | null;
}

export interface ReplyDto {
    id: number;
    postId: number;
    userId: number;
    authorName: string;
    authorUsername: string;
    content: string;
    likes: number;
    createdAt: string;
}

// Kept for backwards-compat consumers; backend may still return the full thread.
export interface PostWithRepliesDto extends PostInfoDto {
    replies: ReplyDto[];
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    hasMore?: boolean;
}

export interface PostListParams {
    page?: number;
    pageSize?: number;
    clubId?: number;
}

export interface CommentListParams {
    page?: number;
    pageSize?: number;
}

// ─── Response envelope ───────────────────────────────────────────────────────

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };
const unwrap = <T>(res: { data: ApiResponse<T> }): T => res.data.data;

// Some legacy endpoints still return raw arrays. Normalise to PaginatedResult
// so callers always work against the same shape.
function toPaginated<T>(
    raw: PaginatedResult<T> | T[] | null | undefined,
    fallbackPage = 1,
    fallbackPageSize = 20,
): PaginatedResult<T> {
    if (Array.isArray(raw)) {
        return {
            items: raw,
            page: fallbackPage,
            pageSize: fallbackPageSize,
            totalCount: raw.length,
            hasMore: false,
        };
    }
    if (raw && Array.isArray(raw.items)) return raw;
    return { items: [], page: fallbackPage, pageSize: fallbackPageSize, totalCount: 0, hasMore: false };
}

// ─── API surface ─────────────────────────────────────────────────────────────

const postApi = {
    // 1. List posts with pagination + optional clubId filter
    list: (params?: PostListParams): Promise<PaginatedResult<PostInfoDto>> =>
        axiosInstance
            .get<ApiResponse<PaginatedResult<PostInfoDto> | PostInfoDto[]>>('/posts', { params })
            .then((res) => toPaginated<PostInfoDto>(unwrap(res), params?.page ?? 1, params?.pageSize ?? 20)),

    getById: (id: number) =>
        axiosInstance.get<ApiResponse<PostWithRepliesDto>>(`/posts/${id}`).then(unwrap),

    getByUser: (userId: number) =>
        axiosInstance.get<ApiResponse<PostInfoDto[]>>(`/posts/user/${userId}`).then(unwrap),

    // 2. Create post (Bearer token attached by axiosInstance request interceptor)
    create: (dto: PostCreateDto) =>
        axiosInstance.post<ApiResponse<number>>('/posts', dto).then(unwrap),

    // 3. Edit post (server enforces author-or-admin via JWT)
    update: (id: number, dto: PostUpdateDto) =>
        axiosInstance.put<ApiResponse<void>>(`/posts/${id}`, dto).then((r) => r.data),

    // 4. Delete post
    delete: (id: number) =>
        axiosInstance.delete(`/posts/${id}`),

    like: (postId: number) =>
        axiosInstance.post<ApiResponse<number>>(`/posts/${postId}/like`).then(unwrap),

    // 5. Paginated comments for a post
    getComments: (postId: number, params?: CommentListParams): Promise<PaginatedResult<ReplyDto>> =>
        axiosInstance
            .get<ApiResponse<PaginatedResult<ReplyDto> | ReplyDto[]>>(`/posts/${postId}/comments`, { params })
            .then((res) => toPaginated<ReplyDto>(unwrap(res), params?.page ?? 1, params?.pageSize ?? 20)),

    // 6. Add comment (userId comes from JWT on the server)
    addComment: (postId: number, content: string) =>
        axiosInstance.post<ApiResponse<number>>(`/posts/${postId}/comments`, { content }).then(unwrap),

    // 7. Delete comment
    deleteComment: (commentId: number) =>
        axiosInstance.delete(`/comments/${commentId}`),

    // ─── Legacy aliases (kept so existing callers keep compiling) ─────────────
    /** @deprecated use `list({ page, pageSize, clubId })` */
    getAll: (): Promise<PostInfoDto[]> =>
        axiosInstance
            .get<ApiResponse<PaginatedResult<PostInfoDto> | PostInfoDto[]>>('/posts')
            .then((res) => toPaginated<PostInfoDto>(unwrap(res)).items),

    /** @deprecated use `addComment(postId, content)` */
    addReply: (dto: PostReplyCreateDto) =>
        axiosInstance.post<ApiResponse<number>>(`/posts/${dto.postId}/comments`, { content: dto.content }).then(unwrap),
};

export default postApi;
