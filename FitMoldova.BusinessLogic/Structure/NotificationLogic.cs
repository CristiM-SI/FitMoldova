using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
    public class NotificationLogic : NotificationAction, INotificationLogic
    {
        public ServiceResponse GetForUser(int userId)                                                      => GetForUserExecution(userId);
        public ServiceResponse GetUnreadCount(int userId)                                                  => GetUnreadCountExecution(userId);
        public ServiceResponse MarkAsRead(int notificationId, int userId)                                  => MarkAsReadExecution(notificationId, userId);
        public ServiceResponse MarkAllAsRead(int userId)                                                   => MarkAllAsReadExecution(userId);
        public ServiceResponse Delete(int notificationId, int userId)                                      => DeleteExecution(notificationId, userId);
        public ServiceResponse Create(int userId, int fromUserId, string type, string content)             => CreateExecution(userId, fromUserId, type, content);
    }
}
