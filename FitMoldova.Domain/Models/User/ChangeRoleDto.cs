namespace FitMoldova.Domain.Models.User
{
     public class ChangeRoleDto
     {
          public string Role { get; set; } = string.Empty; // "User" | "Moderator" | "Admin"
     }
}
