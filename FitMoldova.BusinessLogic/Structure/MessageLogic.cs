using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
    public class MessageLogic : MessageAction, IMessageLogic
    {
        public ServiceResponse GetConversations(int userId)                          => GetConversationsExecution(userId);
        public ServiceResponse GetMessages(int userId, int otherUserId)              => GetMessagesExecution(userId, otherUserId);
        public ServiceResponse SendMessage(int senderId, int receiverId, string content) => SendMessageExecution(senderId, receiverId, content);
        public ServiceResponse MarkConversationAsRead(int userId, int otherUserId)   => MarkConversationAsReadExecution(userId, otherUserId);
        public ServiceResponse GetUnreadCount(int userId)                            => GetUnreadCountExecution(userId);
        public ServiceResponse DeleteMessage(int messageId, int senderId)            => DeleteMessageExecution(messageId, senderId);
    }
}
