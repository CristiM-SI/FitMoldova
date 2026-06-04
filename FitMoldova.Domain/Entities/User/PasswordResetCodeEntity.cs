using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.User
{
    // Cod de resetare a parolei trimis pe email. Codul în clar NU este stocat —
    // se păstrează doar hash-ul BCrypt (CodeHash) și se verifică cu BCrypt.Verify.
    public class PasswordResetCodeEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public UDTable User { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string CodeHash { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
