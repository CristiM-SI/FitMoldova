namespace FitMoldova.Domain.Models.Club
{
    /// <summary>
    /// DTO de răspuns — conține MembersCount calculat din tabela ClubMembers.
    /// </summary>
    public class ClubInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Schedule { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        /// <summary>Numărul de membri înscriși — COUNT(*) din ClubMembers.</summary>
        public int MembersCount { get; set; }
    }
}
