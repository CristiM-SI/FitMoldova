namespace FitMoldova.Domain.Models.Route
{
     public class RouteInfoDto
     {
          public int Id { get; set; }
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
          public string Icon { get; set; } = string.Empty;
          public string BestSeason { get; set; } = string.Empty;
          public double StartLat { get; set; }
          public double StartLng { get; set; }
          public double EndLat { get; set; }
          public double EndLng { get; set; }
          public List<string> Highlights { get; set; } = new();
          public List<RouteCoordDto> Path { get; set; } = new();

     }
}