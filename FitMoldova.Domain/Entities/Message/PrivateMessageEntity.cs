using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;

namespace FitMoldova.Domain.Entities.Message
{
    public class PrivateMessageEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// ID-ul utilizatorului care TRIMITE mesajul
        public int SenderId { get; set; }

        /// ID-ul utilizatorului care PRIMEȘTE mesajul
        public int ReceiverId { get; set; }

        /// Conținutul mesajului
        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;

        /// True dacă destinatarul a văzut mesajul
        public bool IsRead { get; set; } = false;

        /// True dacă mesajul a fost șters de expeditor (soft delete)
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public UDTable Sender { get; set; } = null!;
        public UDTable Receiver { get; set; } = null!;
    }
}
