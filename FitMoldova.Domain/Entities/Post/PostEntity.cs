using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;

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

          public ICollection<PostReplyEntity> Replies { get; set; } = new List<PostReplyEntity>();
     }
}