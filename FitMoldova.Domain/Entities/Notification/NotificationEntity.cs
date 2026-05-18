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

          /// Tipul notificării: "like" | "reply" | "follow" | "repost" | "mention" | "bookmark" | "club_post"
          [Required]
          [StringLength(20)]
          public string Type { get; set; } = string.Empty;

          /// Textul descriptiv al notificării
          [Required]
          [StringLength(500)]
          public string Content { get; set; } = string.Empty;

          /// ID-ul postării asociate (pentru tipul "club_post") — permite redirect direct la post
          public int? PostId { get; set; }

          /// ID-ul clubului asociat (pentru tipul "club_post")
          public int? ClubId { get; set; }

          public bool IsRead { get; set; } = false;

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
     }
}