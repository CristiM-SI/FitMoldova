namespace FitMoldova.Domain.Models.Activity
{
    /// <summary>
    /// DTO returnat pe pagina principală — ce vede orice user.
    /// </summary>
    public class ActivityInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Distance { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int Calories { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;   // username-ul adminului
        public int ParticipantsCount { get; set; }
    }
}
