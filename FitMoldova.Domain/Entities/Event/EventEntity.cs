using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Event
{
     public class EventEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(100)]
          public string Name { get; set; } = string.Empty;

          public string Description { get; set; } = string.Empty;
          public DateTime Date { get; set; }

          [StringLength(100)]
          public string Location { get; set; } = string.Empty;

          [StringLength(60)]
          public string City { get; set; } = string.Empty;

          [StringLength(30)]
          public string Category { get; set; } = string.Empty;

          public int Participants { get; set; } = 0;
          public int MaxParticipants { get; set; }

          [StringLength(30)]
          public string Price { get; set; } = string.Empty;

          [StringLength(80)]
          public string Organizer { get; set; } = string.Empty;

          [StringLength(20)]
          public string Difficulty { get; set; } = string.Empty;
          
          [StringLength(500)]
          public string ImageUrl { get; set; } = string.Empty;
     }
}