namespace FitMoldova.Domain.Models.Post
{
     public class PostInfoDto
     {
          public int Id { get; set; }
          public int UserId { get; set; }
          public string AuthorName { get; set; } = string.Empty;
          public string AuthorUsername { get; set; } = string.Empty;
          public string Content { get; set; } = string.Empty;
          public string Sport { get; set; } = string.Empty;
          public int Likes { get; set; }
          public int CommentsCount { get; set; }
          public DateTime CreatedAt { get; set; }
     }

}
