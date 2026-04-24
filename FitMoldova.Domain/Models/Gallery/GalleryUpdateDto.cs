namespace FitMoldova.Domain.Models.Gallery
{
     /// <summary>
     /// Pentru update metadate (nu schimbăm fișierul după upload — pentru asta se face delete + upload nou).
     /// </summary>
     public class GalleryUpdateDto
     {
          public string Title { get; set; } = string.Empty;
          public string Description { get; set; } = string.Empty;
          public string Category { get; set; } = "Altele";
          public List<string> Tags { get; set; } = new();
          public bool IsPublished { get; set; } = true;
     }
}
