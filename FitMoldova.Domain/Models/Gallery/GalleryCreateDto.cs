namespace FitMoldova.Domain.Models.Gallery
{
     /// <summary>
     /// Metadatele trimise la upload. Fișierul în sine vine separat ca IFormFile
     /// în body-ul multipart (vezi GalleryController.Upload).
     /// Stilul proiectului: fără adnotări de validare pe DTO — validăm în Action.
     /// </summary>
     public class GalleryCreateDto
     {
          public string Title { get; set; } = string.Empty;
          public string Description { get; set; } = string.Empty;
          public string Category { get; set; } = "Altele";

          /// <summary>Listă de tag-uri, max 10 elemente, fiecare max 30 caractere.</summary>
          public List<string> Tags { get; set; } = new();
     }
}
