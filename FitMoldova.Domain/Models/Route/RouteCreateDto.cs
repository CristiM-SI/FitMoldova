namespace FitMoldova.Domain.Models.Route
{
     public class RouteCreateDto
     {
          public string Name { get; set; } = string.Empty;
          public string Type { get; set; } = string.Empty;
          public string Difficulty { get; set; } = string.Empty;
          public double Distance { get; set; }
          public int EstimatedDuration { get; set; }
          public int ElevationGain { get; set; }
          public string Description { get; set; } = string.Empty;
          public string Region { get; set; } = string.Empty;
          public string Surface { get; set; } = string.Empty;
          public bool IsLoop { get; set; }
     }
}