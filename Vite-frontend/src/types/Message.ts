export interface MessageInfoDto {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    senderUsername: string;
    senderFirstName: string;
    senderLastName: string;
    senderAvatar?: string | null;
}

export interface ConversationPreviewDto {
    otherUserId: number;
    otherUsername: string;
    otherFirstName: string;
    otherLastName: string;
    otherAvatar?: string | null;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}