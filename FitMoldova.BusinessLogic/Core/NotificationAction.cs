using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Notification;
using FitMoldova.Domain.Models.Notification;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
    public class NotificationAction
    {
        private readonly DbSession _dbSession = new DbSession();

        // Culori deterministe pentru avatare (index = fromUserId % culori.Length)
        private static readonly string[] AvatarColors =
        {
            "#1a6fff", "#e91e8c", "#00b894", "#9b59b6",
            "#e67e22", "#2ecc71", "#e74c3c", "#3498db",
            "#f39c12", "#1abc9c"
        };

        private static string GetAvatarColor(int userId) =>
            AvatarColors[Math.Abs(userId) % AvatarColors.Length];

        private static string GetInitials(string firstName, string lastName)
        {
            var f = string.IsNullOrWhiteSpace(firstName) ? "?" : firstName[0].ToString().ToUpper();
            var l = string.IsNullOrWhiteSpace(lastName)  ? "" : lastName[0].ToString().ToUpper();
            return f + l;
        }

        // ── GET pentru utilizatorul curent ────────────────────────────────────

        public ServiceResponse GetForUserExecution(int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();

            var notifs = (
                from n in ctx.Notifications
                where n.UserId == userId
                join u in ctx.Users on n.FromUserId equals u.Id into fromUsers
                from fu in fromUsers.DefaultIfEmpty()
                orderby n.IsRead ascending, n.CreatedAt descending
                select new NotificationInfoDto
                {
                    Id             = n.Id,
                    Type           = n.Type,
                    FromUserId     = n.FromUserId,
                    FromUserName   = fu != null ? fu.FirstName + " " + fu.LastName : "FitMoldova",
                    FromUserHandle = fu != null ? "@" + fu.Username : "@fitmoldova",
                    FromUserAvatar = fu != null ? GetInitials(fu.FirstName, fu.LastName) : "FM",
                    FromUserColor  = GetAvatarColor(n.FromUserId),
                    Content        = n.Content,
                    CreatedAt      = n.CreatedAt,
                    IsRead         = n.IsRead,
                }
            ).ToList();

            return new ServiceResponse { isSuccess = true, Data = notifs };
        }

        // ── GET unread count ──────────────────────────────────────────────────

        public ServiceResponse GetUnreadCountExecution(int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var count = ctx.Notifications.Count(n => n.UserId == userId && !n.IsRead);
            return new ServiceResponse { isSuccess = true, Data = count };
        }

        // ── MARK AS READ (una) ────────────────────────────────────────────────

        public ServiceResponse MarkAsReadExecution(int notificationId, int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Notifications.FirstOrDefault(n => n.Id == notificationId && n.UserId == userId);
            if (entity == null)
                return new ServiceResponse { isSuccess = false, Message = "Notificarea nu a fost găsită." };

            entity.IsRead = true;
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Notificare marcată ca citită." };
        }

        // ── MARK ALL AS READ ──────────────────────────────────────────────────

        public ServiceResponse MarkAllAsReadExecution(int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var unread = ctx.Notifications.Where(n => n.UserId == userId && !n.IsRead).ToList();
            foreach (var n in unread) n.IsRead = true;
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = $"{unread.Count} notificări marcate ca citite." };
        }

        // ── DELETE (una) ──────────────────────────────────────────────────────

        public ServiceResponse DeleteExecution(int notificationId, int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Notifications.FirstOrDefault(n => n.Id == notificationId && n.UserId == userId);
            if (entity == null)
                return new ServiceResponse { isSuccess = false, Message = "Notificarea nu a fost găsită." };

            ctx.Notifications.Remove(entity);
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Notificare ștearsă." };
        }

        // ── CREATE (folosit intern de alte module) ────────────────────────────

        public ServiceResponse CreateExecution(int userId, int fromUserId, string type, string content)
        {
            if (string.IsNullOrWhiteSpace(type))
                return new ServiceResponse { isSuccess = false, Message = "Tipul notificării este obligatoriu." };
            if (string.IsNullOrWhiteSpace(content))
                return new ServiceResponse { isSuccess = false, Message = "Conținutul notificării este obligatoriu." };

            using var ctx = _dbSession.FitMoldovaContext();
            var entity = new NotificationEntity
            {
                UserId     = userId,
                FromUserId = fromUserId,
                Type       = type.Trim(),
                Content    = content.Trim(),
                IsRead     = false,
                CreatedAt  = DateTime.UtcNow,
            };
            ctx.Notifications.Add(entity);
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Data = entity.Id };
        }
    }
}
