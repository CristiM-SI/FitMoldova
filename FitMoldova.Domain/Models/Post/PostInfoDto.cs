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
          public int? ClubId { get; set; }

          // Challenge atașat (opțional)
          public int? AttachedChallengeId { get; set; }
          public int? AttachedChallengeProgress { get; set; }
          public string? AttachedChallengeName { get; set; }

          // Imagine atașată (opțional)
          public string? ImageUrl { get; set; }
          public string? ImageThumbnailUrl { get; set; }

          // Sondaj atașat (opțional)
          public PostPollDto? Poll { get; set; }
     }
}