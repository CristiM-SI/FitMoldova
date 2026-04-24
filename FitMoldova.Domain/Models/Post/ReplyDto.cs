namespace FitMoldova.Domain.Models.Post
{
    public class ReplyDto
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorUsername { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Likes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
