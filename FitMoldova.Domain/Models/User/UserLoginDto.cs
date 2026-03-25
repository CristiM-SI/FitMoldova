namespace FitMoldova.Domain.Models.User
{
     public class UserLoginDto
     {
          public string Credential { get; set; } = string.Empty;
          public string Password { get; set; } = string.Empty;
     }
}