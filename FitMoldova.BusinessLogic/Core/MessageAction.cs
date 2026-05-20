using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Message;
using FitMoldova.Domain.Models.Message;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
    public class MessageAction
    {
        private readonly DbSession _dbSession = new DbSession();

        // ── GET CONVERSATIONS ─────────────────────────────────────────────────
        // Returnează lista de conversații a unui user.
        // Pentru fiecare conversație: info despre celălalt user, ultimul mesaj,
        // data acestuia și câte mesaje necitite sunt.

        public ServiceResponse GetConversationsExecution(int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();

            // Găsim toți userii cu care userId a schimbat cel puțin un mesaj
            var partnerIds = ctx.PrivateMessages
                .Where(m => !m.IsDeleted && (m.SenderId == userId || m.ReceiverId == userId))
                .Select(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Distinct()
                .ToList();

            var conversations = new List<ConversationPreviewDto>();

            foreach (var partnerId in partnerIds)
            {
                // Ultimul mesaj din conversație (în orice direcție)
                var lastMsg = ctx.PrivateMessages
                    .Where(m => !m.IsDeleted &&
                                ((m.SenderId == userId && m.ReceiverId == partnerId) ||
                                 (m.SenderId == partnerId && m.ReceiverId == userId)))
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefault();

                if (lastMsg == null) continue;

                var partner = ctx.Users.FirstOrDefault(u => u.Id == partnerId);
                if (partner == null) continue;

                // Mesaje trimise de partner către userId care nu au fost citite
                var unread = ctx.PrivateMessages.Count(m =>
                    m.SenderId == partnerId &&
                    m.ReceiverId == userId &&
                    !m.IsRead &&
                    !m.IsDeleted);

                conversations.Add(new ConversationPreviewDto
                {
                    OtherUserId    = partnerId,
                    OtherUsername  = partner.Username,
                    OtherFirstName = partner.FirstName,
                    OtherLastName  = partner.LastName,
                    OtherAvatar    = partner.ProfileImageUrl,
                    LastMessage    = lastMsg.Content.Length > 80
                        ? lastMsg.Content[..80] + "…"
                        : lastMsg.Content,
                    LastMessageAt  = lastMsg.CreatedAt,
                    UnreadCount    = unread,
                });
            }

            // Sortare: conversația cu cel mai recent mesaj — prima
            conversations = conversations
                .OrderByDescending(c => c.LastMessageAt)
                .ToList();

            return new ServiceResponse { isSuccess = true, Data = conversations };
        }

        // ── GET MESSAGES (istoria dintre doi useri) ───────────────────────────

        public ServiceResponse GetMessagesExecution(int userId, int otherUserId)
        {
            using var ctx = _dbSession.FitMoldovaContext();

            var messages = (
                from m in ctx.PrivateMessages
                where !m.IsDeleted &&
                      ((m.SenderId == userId   && m.ReceiverId == otherUserId) ||
                       (m.SenderId == otherUserId && m.ReceiverId == userId))
                join sender in ctx.Users on m.SenderId equals sender.Id
                orderby m.CreatedAt ascending
                select new MessageInfoDto
                {
                    Id            = m.Id,
                    SenderId      = m.SenderId,
                    ReceiverId    = m.ReceiverId,
                    Content       = m.Content,
                    IsRead        = m.IsRead,
                    CreatedAt     = m.CreatedAt,
                    SenderUsername  = sender.Username,
                    SenderFirstName = sender.FirstName,
                    SenderLastName  = sender.LastName,
                    SenderAvatar    = sender.ProfileImageUrl,
                }
            ).ToList();

            return new ServiceResponse { isSuccess = true, Data = messages };
        }

        // ── SEND MESSAGE ──────────────────────────────────────────────────────
        // Salvează mesajul în DB și returnează DTO-ul complet (pentru SignalR).

        public ServiceResponse SendMessageExecution(int senderId, int receiverId, string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return new ServiceResponse { isSuccess = false, Message = "Mesajul nu poate fi gol." };

            if (content.Length > 2000)
                return new ServiceResponse { isSuccess = false, Message = "Mesajul depășește 2000 de caractere." };

            if (senderId == receiverId)
                return new ServiceResponse { isSuccess = false, Message = "Nu îți poți trimite mesaje ție însuți." };

            using var ctx = _dbSession.FitMoldovaContext();

            // Verificăm că destinatarul există
            var receiver = ctx.Users.FirstOrDefault(u => u.Id == receiverId);
            if (receiver == null)
                return new ServiceResponse { isSuccess = false, Message = "Utilizatorul destinatar nu există." };

            var sender = ctx.Users.FirstOrDefault(u => u.Id == senderId);

            var entity = new PrivateMessageEntity
            {
                SenderId   = senderId,
                ReceiverId = receiverId,
                Content    = content.Trim(),
                IsRead     = false,
                IsDeleted  = false,
                CreatedAt  = DateTime.UtcNow,
            };

            ctx.PrivateMessages.Add(entity);
            ctx.SaveChanges();

            // Returnăm DTO complet — ChatHub îl va trimite live prin SignalR
            var dto = new MessageInfoDto
            {
                Id              = entity.Id,
                SenderId        = senderId,
                ReceiverId      = receiverId,
                Content         = entity.Content,
                IsRead          = false,
                CreatedAt       = entity.CreatedAt,
                SenderUsername  = sender?.Username  ?? "",
                SenderFirstName = sender?.FirstName ?? "",
                SenderLastName  = sender?.LastName  ?? "",
                SenderAvatar    = sender?.ProfileImageUrl,
            };

            return new ServiceResponse { isSuccess = true, Data = dto };
        }

        // ── MARK AS READ ──────────────────────────────────────────────────────

        public ServiceResponse MarkConversationAsReadExecution(int userId, int otherUserId)
        {
            using var ctx = _dbSession.FitMoldovaContext();

            var unread = ctx.PrivateMessages
                .Where(m => m.SenderId == otherUserId && m.ReceiverId == userId && !m.IsRead)
                .ToList();

            foreach (var m in unread) m.IsRead = true;
            ctx.SaveChanges();

            return new ServiceResponse { isSuccess = true, Message = $"{unread.Count} mesaje marcate ca citite." };
        }

        // ── UNREAD COUNT (pentru badge navbar) ───────────────────────────────

        public ServiceResponse GetUnreadCountExecution(int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var count = ctx.PrivateMessages.Count(m => m.ReceiverId == userId && !m.IsRead && !m.IsDeleted);
            return new ServiceResponse { isSuccess = true, Data = count };
        }

        // ── DELETE (soft) ─────────────────────────────────────────────────────

        public ServiceResponse DeleteMessageExecution(int messageId, int senderId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.PrivateMessages.FirstOrDefault(m => m.Id == messageId && m.SenderId == senderId);
            if (entity == null)
                return new ServiceResponse { isSuccess = false, Message = "Mesajul nu a fost găsit sau nu ai permisiunea." };

            entity.IsDeleted = true;
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Mesaj șters." };
        }
    }
}
