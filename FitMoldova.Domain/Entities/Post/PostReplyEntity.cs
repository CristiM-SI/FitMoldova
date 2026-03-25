using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Post
{
     public class PostReplyEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          public int PostId { get; set; }
          public int UserId { get; set; }

          [Required]
          public string Content { get; set; } = string.Empty;

          public int Likes { get; set; } = 0;
          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
     }
}