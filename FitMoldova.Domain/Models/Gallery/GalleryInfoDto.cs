namespace FitMoldova.Domain.Models.Gallery
{
     /// <summary>
     /// Forma în care imaginea e returnată către frontend.
     /// ImageUrl și ThumbnailUrl sunt relative (încep cu /uploads/...) —
     /// frontend-ul le prefixează cu BASE_URL dacă e nevoie.
     /// </summary>
     public class GalleryInfoDto
     {
          public int Id { get; set; }
          public string Title { get; set; } = string.Empty;
          public string Description { get; set; } = string.Empty;
          public string Category { get; set; } = string.Empty;
          public List<string> Tags { get; set; } = new();

          public string ImageUrl { get; set; } = string.Empty;
          public string ThumbnailUrl { get; set; } = string.Empty;

          public long FileSizeBytes { get; set; }
          public int Width { get; set; }
          public int Height { get; set; }

          public int UploadedByUserId { get; set; }
          public DateTime CreatedAt { get; set; }
          public bool IsPublished { get; set; }
     }
}
