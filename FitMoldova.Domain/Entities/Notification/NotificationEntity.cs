using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Notification
{
    public class NotificationEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// ID-ul utilizatorului care PRIMEȘTE notificarea
        public int UserId { get; set; }

        /// ID-ul utilizatorului care A DECLANȘAT notificarea (0 = sistem)
        public int FromUserId { get; set; }

        /// Tipul notificării: "like" | "reply" | "follow" | "repost" | "mention" | "bookmark"
        [Required]
        [StringLength(20)]
        public string Type { get; set; } = string.Empty;

        /// Textul descriptiv al notificării
        [Required]
        [StringLength(500)]
        public string Content { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
