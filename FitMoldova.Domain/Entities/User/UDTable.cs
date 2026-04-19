using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Entities.Post;
using FitMoldova.Domain.Enums;

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

          [StringLength(50)]
          public string FirstName { get; set; } = string.Empty;

          [StringLength(50)]
          public string LastName { get; set; } = string.Empty;

          [Required]
          [StringLength(100)]
          public string Password { get; set; } = string.Empty;

          [Required]
          [StringLength(100)]
          public string Email { get; set; } = string.Empty;

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

          public UserRole Role { get; set; } = UserRole.User;
          
          [StringLength(20)]
          public string? Phone { get; set; }

          [StringLength(100)]
          public string? Location { get; set; }

          [StringLength(500)]
          public string? Bio { get; set; }

          [StringLength(300)]
          public string? ProfileImageUrl { get; set; }

          public bool IsActive { get; set; } = true;

          public DateTime? LastLoginAt { get; set; }

          public ICollection<ActivityEntity> Activities { get; set; } = new List<ActivityEntity>();
          public ICollection<PostEntity> Posts { get; set; } = new List<PostEntity>();
     }
}