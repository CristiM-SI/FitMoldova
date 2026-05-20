// src/services/api/messageApi.ts
import axiosInstance from './axiosInstance';
import type { MessageInfoDto, ConversationPreviewDto } from '../../types/Message';

type ApiResponse<T> = { isSuccess: boolean; data: T; message?: string };

function unwrap<T>(res: { data: ApiResponse<T> }): T {
  return res.data.data;
}

const messageApi = {
  /** GET /api/messages/conversations — lista conversațiilor */
  getConversations: () =>
    axiosInstance
      .get<ApiResponse<ConversationPreviewDto[]>>('/messages/conversations')
      .then(unwrap),

  /** GET /api/messages/{otherUserId} — istoricul mesajelor cu un user */
  getMessages: (otherUserId: number) =>
    axiosInstance
      .get<ApiResponse<MessageInfoDto[]>>(`/messages/${otherUserId}`)
      .then(unwrap),

  /** POST /api/messages — trimite un mesaj (REST fallback) */
  sendMessage: (receiverId: number, content: string) =>
    axiosInstance
      .post<ApiResponse<MessageInfoDto>>('/messages', { receiverId, content })
      .then(unwrap),

  /** PATCH /api/messages/{otherUserId}/read — marchează ca citite */
  markAsRead: (otherUserId: number) =>
    axiosInstance
      .patch<ApiResponse<void>>(`/messages/${otherUserId}/read`)
      .then((r) => r.data),

  /** GET /api/messages/unread-count — badge navbar */
  getUnreadCount: () =>
    axiosInstance
      .get<ApiResponse<number>>('/messages/unread-count')
      .then(unwrap),

  /** DELETE /api/messages/{messageId} — șterge un mesaj */
  deleteMessage: (messageId: number) =>
    axiosInstance.delete(`/messages/${messageId}`),
};

export default messageApi;
