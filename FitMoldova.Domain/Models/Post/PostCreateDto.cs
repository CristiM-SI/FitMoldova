namespace FitMoldova.Domain.Models.Post
{
     public class PostCreateDto
     {
          public int UserId { get; set; }
          public string Content { get; set; } = string.Empty;
          public string Sport { get; set; } = string.Empty;
     }

}