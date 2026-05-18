namespace FitMoldova.Domain.Models.Post
{
    public class PostCreateResultDto
    {
        public int PostId { get; set; }
        public int? ClubId { get; set; }
        public List<int>? MemberIds { get; set; }
        public string? ClubName { get; set; }
        public string? AuthorName { get; set; }
    }
}
