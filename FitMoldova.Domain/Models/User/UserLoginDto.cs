using System.ComponentModel.DataAnnotations;

namespace FitMoldova.Domain.Models.User
{
    public class UserLoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }
}
