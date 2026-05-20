namespace FitMoldova.Domain.Models.Message
{
    /// DTO returnat la GET — un mesaj complet cu info despre expeditor
    public class MessageInfoDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

        // Info expeditor (pentru UI)
        public string SenderUsername { get; set; } = string.Empty;
        public string SenderFirstName { get; set; } = string.Empty;
        public string SenderLastName { get; set; } = string.Empty;
        public string? SenderAvatar { get; set; }
    }

    /// DTO pentru trimiterea unui mesaj nou
    public class MessageCreateDto
    {
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
    }

    /// DTO pentru un fir de conversație (preview în lista de chat-uri)
    public class ConversationPreviewDto
    {
        public int OtherUserId { get; set; }
        public string OtherUsername { get; set; } = string.Empty;
        public string OtherFirstName { get; set; } = string.Empty;
        public string OtherLastName { get; set; } = string.Empty;
        public string? OtherAvatar { get; set; }
        public string LastMessage { get; set; } = string.Empty;
        public DateTime LastMessageAt { get; set; }
        public int UnreadCount { get; set; }
    }
}
