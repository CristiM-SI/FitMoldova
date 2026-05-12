using System.ComponentModel.DataAnnotations;

namespace FitMoldova.Domain.Models.User
{
    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^(?=(.*[a-zA-Z]){3,})(?=(.*\d){3,})(?=(.*[^a-zA-Z\d]){2,}).{8,}$",
            ErrorMessage = "Password must be at least 8 characters with at least 3 letters, 3 digits, and 2 special characters.")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
