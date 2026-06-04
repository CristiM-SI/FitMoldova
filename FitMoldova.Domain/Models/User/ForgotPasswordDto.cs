using System.ComponentModel.DataAnnotations;

namespace FitMoldova.Domain.Models.User
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}