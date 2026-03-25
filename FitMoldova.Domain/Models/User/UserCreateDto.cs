namespace FitMoldova.Domain.Models.User
{
     public class UserCreateDto
     {
          public string Username { get; set; } = string.Empty;
          public string Password { get; set; } = string.Empty;
          public string Email { get; set; } = string.Empty;
     }
}