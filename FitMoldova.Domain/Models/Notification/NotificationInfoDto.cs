namespace FitMoldova.Domain.Models.Notification
{
    public class NotificationInfoDto
    {
        public int    Id             { get; set; }
        public string Type           { get; set; } = string.Empty;
        public int    FromUserId     { get; set; }
        public string FromUserName   { get; set; } = string.Empty;
        public string FromUserHandle { get; set; } = string.Empty;
        public string FromUserAvatar { get; set; } = string.Empty; // inițiale, e.g. "IC"
        public string FromUserColor  { get; set; } = string.Empty; // hex color
        public string Content        { get; set; } = string.Empty;
        public DateTime CreatedAt    { get; set; }
        public bool   IsRead         { get; set; }
    }
}
