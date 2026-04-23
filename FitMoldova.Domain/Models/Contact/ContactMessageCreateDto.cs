namespace FitMoldova.Domain.Models.Contact
{
     public class ContactMessageCreateDto
     {
          public string Name { get; set; } = string.Empty;
          public string Email { get; set; } = string.Empty;
          public string Subject { get; set; } = string.Empty;
          public string Message { get; set; } = string.Empty;
     }
}
