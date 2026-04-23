namespace FitMoldova.Domain.Models.Feedback
{
    public class FeedbackStatsDto
    {
        public double AverageRating { get; set; }
        public int TotalCount { get; set; }
        public int SatisfactionPct { get; set; }
        public List<FeedbackStarDistribution> Distribution { get; set; } = new();
    }

    public class FeedbackStarDistribution
    {
        public int Star { get; set; }
        public int Count { get; set; }
        public int Pct { get; set; }
    }
}
