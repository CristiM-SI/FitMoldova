export type NotifType = 'like' | 'reply' | 'follow' | 'repost' | 'mention' | 'bookmark';

/** DTO primit de la GET /api/notification */
export interface NotificationInfoDto {
    id: number;
    type: NotifType;
    fromUserId: number;
    fromUserName: string;
    fromUserHandle: string;
    fromUserAvatar: string;   // inițiale, e.g. "IC"
    fromUserColor: string;    // hex color pentru avatar
    content: string;
    createdAt: string;        // ISO date string
    isRead: boolean;
}

/** DTO pentru PATCH /api/notification/:id/read */
export interface NotificationMarkReadDto {
    id: number;
}
