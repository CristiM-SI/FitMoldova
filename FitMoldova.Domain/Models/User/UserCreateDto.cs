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
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        public string? Username { get; set; }
        public string? Phone { get; set; }
        public string? Location { get; set; }
        public string? Bio { get; set; }
    }
}
