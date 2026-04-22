using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;

namespace FitMoldova.Domain.Entities.Event
{
     public class EventParticipantEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          public int EventId { get; set; }
          public EventEntity Event { get; set; } = null!;

          public int UserId { get; set; }
          public UDTable User { get; set; } = null!;

          public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
     }
}