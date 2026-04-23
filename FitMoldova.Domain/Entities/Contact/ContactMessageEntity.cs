using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Contact
{
     public class ContactMessageEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(100)]
          public string Name { get; set; } = string.Empty;

          [Required]
          [StringLength(150)]
          public string Email { get; set; } = string.Empty;

          [Required]
          [StringLength(50)]
          public string Subject { get; set; } = string.Empty;

          [Required]
          [StringLength(2000)]
          public string Message { get; set; } = string.Empty;

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

          
          public bool IsRead { get; set; } = false;

          /// Statutul tichetului: "new" | "in-progress" | "closed"
          [StringLength(20)]
          public string Status { get; set; } = "new";
     }
}
