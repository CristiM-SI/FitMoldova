namespace FitMoldova.Domain.Models.Contact
{
     
     public class ContactMessageInfoDto
     {
          public int Id { get; set; }
          public string Name { get; set; } = string.Empty;
          public string Email { get; set; } = string.Empty;
          public string Subject { get; set; } = string.Empty;
          public string Message { get; set; } = string.Empty;
          public DateTime CreatedAt { get; set; }
          public bool IsRead { get; set; }
          public string Status { get; set; } = string.Empty;
     }
}
