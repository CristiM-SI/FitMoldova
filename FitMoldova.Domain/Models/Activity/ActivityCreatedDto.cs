namespace FitMoldova.Domain.Models.Activity
{
     public class ActivityCreateDto
     {
          public int UserId { get; set; }        // ID-ul adminului care creează
          public string Name { get; set; } = string.Empty;
          public string Type { get; set; } = string.Empty;
          public string Distance { get; set; } = string.Empty;
          public string Duration { get; set; } = string.Empty;
          public int Calories { get; set; }
          public DateTime Date { get; set; }
          public string Description { get; set; } = string.Empty;
          public string ImageUrl { get; set; } = string.Empty;
     }
}