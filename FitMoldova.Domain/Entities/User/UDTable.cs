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

          // ── Câmpuri CRIPTATE la rest cu AES-256-GCM ──────────────────────────
          // StringLength mărit față de original pentru a acomoda:
          //   ciphertext_base64_len ≈ 4/3 × (12 nonce + plaintext + 16 tag)
          // Vezi FitMoldovaContext.OnModelCreating pentru wiring.

          [StringLength(200)]  // era 20 — mărit pentru ciphertext Base64
          public string? Phone { get; set; }

          [StringLength(400)]  // era 100
          public string? Location { get; set; }

          [StringLength(1000)] // era 500
          public string? Bio { get; set; }

          // NECriptat — URL public spre imaginea de profil, nu e PII sensibil
          [StringLength(300)]
          public string? ProfileImageUrl { get; set; }

          public bool IsActive { get; set; } = true;

          public DateTime? LastLoginAt { get; set; }

          public ICollection<ActivityEntity> Activities { get; set; } = new List<ActivityEntity>();
          public ICollection<PostEntity> Posts { get; set; } = new List<PostEntity>();
     }
}
