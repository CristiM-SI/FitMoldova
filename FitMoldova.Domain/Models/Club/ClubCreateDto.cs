namespace FitMoldova.Domain.Models.Club
{
     public class ClubCreateDto
     {
          public string Name { get; set; } = string.Empty;
          public string Category { get; set; } = string.Empty;
          public string Location { get; set; } = string.Empty;
          public string Description { get; set; } = string.Empty;
          public string Schedule { get; set; } = string.Empty;
          public string Level { get; set; } = string.Empty;
     }
}