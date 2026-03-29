using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Entities.Post;

namespace FitMoldova.Domain.Entities.User
{
     public class UDTable
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(40)]
          public string Username { get; set; } = string.Empty;

          [Required]
          [StringLength(100)]
          public string Password { get; set; } = string.Empty;

          [Required]
          [StringLength(100)]
          public string Email { get; set; } = string.Empty;

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

          [StringLength(10)]
          public string Role { get; set; } = "user";

          public ICollection<ActivityEntity> Activities { get; set; } = new List<ActivityEntity>();
          public ICollection<PostEntity> Posts { get; set; } = new List<PostEntity>();
     }
}