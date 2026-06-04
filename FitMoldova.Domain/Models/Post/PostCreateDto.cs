namespace FitMoldova.Domain.Models.Post
{
     public class PostCreateDto
     {
          public int UserId { get; set; }
          public string Content { get; set; } = string.Empty;
          public string Sport { get; set; } = string.Empty;
          public int? ClubId { get; set; }

          // Opțional: challenge la care userul e înscris (progresul real e preluat din DB).
          public int? AttachedChallengeId { get; set; }

          // Opțional: imagine deja încărcată via POST /api/posts/upload-image.
          public string? ImageUrl { get; set; }
          public string? ImageThumbnailUrl { get; set; }

          // Opțional: sondaj. Se acceptă fie forma plată pollOptions: string[],
          // fie obiectul poll: { question?, options: string[] }. Minim 2, maxim 4 opțiuni.
          public List<string>? PollOptions { get; set; }
          public PollCreateDto? Poll { get; set; }
     }

     public class PollCreateDto
     {
          public string? Question { get; set; }
          public List<string>? Options { get; set; }
     }

}