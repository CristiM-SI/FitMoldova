using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;

namespace FitMoldova.Domain.Entities.Activity
{
     public class ActivityEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          // Păstrăm UserId ca în migrația originală (cine a creat = adminul)
          [Required]
          public int UserId { get; set; }

          [ForeignKey(nameof(UserId))]
          public UDTable User { get; set; } = null!;

          [Required]
          [StringLength(100)]
          public string Name { get; set; } = string.Empty;

          [StringLength(30)]
          public string Type { get; set; } = string.Empty;

          [StringLength(20)]
          public string Distance { get; set; } = string.Empty;

          [StringLength(20)]
          public string Duration { get; set; } = string.Empty;

          public int Calories { get; set; }

          public DateTime Date { get; set; } = DateTime.UtcNow;

          // Câmpuri noi adăugate prin migrație
          public string Description { get; set; } = string.Empty;

          [StringLength(300)]
          public string ImageUrl { get; set; } = string.Empty;

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

          // Participanți — tabelă nouă
          public ICollection<ActivityParticipantEntity> Participants { get; set; } = new List<ActivityParticipantEntity>();
     }
}