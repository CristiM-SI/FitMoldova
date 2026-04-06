namespace FitMoldova.Domain.Models.Challenge
{
     public class ChallengeUpdateDto
     {
          public string Name { get; set; } = string.Empty;
          public string Description { get; set; } = string.Empty;
          public string Duration { get; set; } = string.Empty;
          public string Difficulty { get; set; } = string.Empty;
     }
}