namespace FitMoldova.Domain.Models.Feedback
{
    public class FeedbackCreateDto
    {
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<string> Categories { get; set; } = new();
    }
}
