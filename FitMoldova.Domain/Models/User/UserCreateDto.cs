using System.ComponentModel.DataAnnotations;

namespace FitMoldova.Domain.Models.User
{
    public class UserCreateDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^(?=(.*[a-zA-Z]){3,})(?=(.*\d){3,})(?=(.*[^a-zA-Z\d]){2,}).{8,}$",
            ErrorMessage = "Password must be at least 8 characters with at least 3 letters, 3 digits, and 2 special characters.")]
        public string Password { get; set; } = string.Empty;

        public string? Username { get; set; }
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
    }
}
