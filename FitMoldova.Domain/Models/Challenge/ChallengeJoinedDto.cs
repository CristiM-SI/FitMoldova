namespace FitMoldova.Domain.Models.Challenge
{
    public class ChallengeJoinedDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public int Participants { get; set; }
        public DateTime JoinedAt { get; set; }
        public int ProgressPercent { get; set; }
    }
}
