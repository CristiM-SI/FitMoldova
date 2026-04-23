namespace FitMoldova.Domain.Models.Feedback
{
    public class FeedbackInfoDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<string> Categories { get; set; } = new();
        public string Status { get; set; } = string.Empty;
        public bool IsPinned { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
