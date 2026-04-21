using System.ComponentModel.DataAnnotations;

namespace FitMoldova.Domain.Models.Event
{
     public class EventCreateDto
     {
          public string Name { get; set; } = string.Empty;
          public string Description { get; set; } = string.Empty;
          public DateTime Date { get; set; }
          public string Location { get; set; } = string.Empty;
          public string City { get; set; } = string.Empty;
          public string Category { get; set; } = string.Empty;
          public int MaxParticipants { get; set; }
          public string Price { get; set; } = string.Empty;
          public string Organizer { get; set; } = string.Empty;
          public string Difficulty { get; set; } = string.Empty;

          [StringLength(500)]
          public string ImageUrl { get; set; } = string.Empty;
     }
}