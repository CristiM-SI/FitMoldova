namespace FitMoldova.Domain.Models.Post
{
     public class PostWithRepliesDto
     {
          public PostInfoDto Post { get; set; } = new();
          public List<ReplyDto> Replies { get; set; } = new();
     }
}
