namespace FitMoldova.Domain.Models.Post
{
     public class ReplyDto
     {
          public int Id { get; set; }
          public int UserId { get; set; }
          public string AuthorName { get; set; } = string.Empty;
          public string Content { get; set; } = string.Empty;
          public DateTime CreatedAt { get; set; }
     }

     public class PostWithRepliesDto : PostInfoDto
     {
          public List<ReplyDto> Replies { get; set; } = new();
     }
}
