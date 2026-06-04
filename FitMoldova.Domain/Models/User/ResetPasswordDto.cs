using System.ComponentModel.DataAnnotations;

namespace FitMoldova.Domain.Models.User
{
    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Code { get; set; } = string.Empty;

        // Aceeași regulă de validare ca la ChangePasswordDto:
        // 8+ caractere, cel puțin 3 litere, 3 cifre și 2 caractere speciale.
        [Required]
        [RegularExpression(@"^(?=(.*[a-zA-Z]){3,})(?=(.*\d){3,})(?=(.*[^a-zA-Z\d]){2,}).{8,}$",
            ErrorMessage = "Password must be at least 8 characters with at least 3 letters, 3 digits, and 2 special characters.")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
