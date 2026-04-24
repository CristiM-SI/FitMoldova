using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
    public interface INotificationLogic
    {
        ServiceResponse GetForUser(int userId);
        ServiceResponse GetUnreadCount(int userId);
        ServiceResponse MarkAsRead(int notificationId, int userId);
        ServiceResponse MarkAllAsRead(int userId);
        ServiceResponse Delete(int notificationId, int userId);

        /// Folosit intern de alte module pentru a crea notificări
        ServiceResponse Create(int userId, int fromUserId, string type, string content);
    }
}
