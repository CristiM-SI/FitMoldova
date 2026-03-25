namespace FitMoldova.Domain.Models.Post
{
     public class PostReplyCreateDto
     {
          public int PostId { get; set; }
          public int UserId { get; set; }
          public string Content { get; set; } = string.Empty;
     }

}