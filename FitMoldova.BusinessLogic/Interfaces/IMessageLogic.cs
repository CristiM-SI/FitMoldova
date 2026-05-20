using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
    public interface IMessageLogic
    {
        /// Returnează toate conversațiile unui user (preview cu ultimul mesaj)
        ServiceResponse GetConversations(int userId);

        /// Returnează istoricul mesajelor dintre doi useri
        ServiceResponse GetMessages(int userId, int otherUserId);

        /// Trimite un mesaj nou (REST fallback)
        ServiceResponse SendMessage(int senderId, int receiverId, string content);

        /// Marchează toate mesajele dintr-o conversație ca citite
        ServiceResponse MarkConversationAsRead(int userId, int otherUserId);

        /// Returnează numărul total de mesaje necitite (pentru badge navbar)
        ServiceResponse GetUnreadCount(int userId);

        /// Șterge un mesaj (soft delete — doar expeditorul poate șterge)
        ServiceResponse DeleteMessage(int messageId, int senderId);
    }
}
