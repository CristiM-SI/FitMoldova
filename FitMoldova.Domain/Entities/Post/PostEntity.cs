using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Entities.Challenge;

namespace FitMoldova.Domain.Entities.Post
{
     public class PostEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          public int UserId { get; set; }

          [ForeignKey(nameof(UserId))]
          public UDTable User { get; set; } = null!;

          [Required]
          public string Content { get; set; } = string.Empty;

          [StringLength(40)]
          public string Sport { get; set; } = string.Empty;

          public int Likes { get; set; } = 0;
          public int CommentsCount { get; set; } = 0;
          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
          public DateTime? UpdatedAt { get; set; }

          public int? ClubId { get; set; }

          public bool IsDeleted { get; set; } = false;

          public int Reposts { get; set; } = 0;
          public bool IsRepost { get; set; } = false;
          public int? OriginalPostId { get; set; }
          public string? PollOptions { get; set; }

          // ── Progres opțional dintr-un challenge atașat postării ──
          public int? AttachedChallengeId { get; set; }

          [ForeignKey(nameof(AttachedChallengeId))]
          public ChallengeEntity? AttachedChallenge { get; set; }

          public int? AttachedChallengeProgress { get; set; }

          // ── Imagine opțională (stocată ca .webp în Cloudinary, exact ca galeria) ──
          public string? ImageUrl { get; set; }
          public string? ImageThumbnailUrl { get; set; }

          // ── Sondaj opțional (1:0..1) ──
          public PollEntity? Poll { get; set; }

          public ICollection<PostReplyEntity> Replies { get; set; } = new List<PostReplyEntity>();
     }
}