using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Gallery
{
     /// <summary>
     /// Reprezintă o imagine din galeria FitMoldova.
     /// Fișierul fizic este stocat pe disk în wwwroot/uploads/gallery,
     /// iar în DB păstrăm doar metadatele + URL-urile relative.
     /// </summary>
     public class GalleryEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(100)]
          public string Title { get; set; } = string.Empty;

          [StringLength(500)]
          public string Description { get; set; } = string.Empty;

          /// <summary>
          /// "Antrenament" | "Competiții" | "Nutriție" | "Recuperare" | "Evenimente" | "Altele"
          /// </summary>
          [Required]
          [StringLength(50)]
          public string Category { get; set; } = "Altele";

          /// <summary>
          /// Tag-uri stocate ca JSON-array de string-uri (ex. ["outdoor","cardio"]).
          /// Am ales JSON ca să evităm un tabel de join pentru o feature MVP.
          /// </summary>
          [Required]
          [Column(TypeName = "text")]
          public string TagsJson { get; set; } = "[]";

          /// <summary>URL-ul public al imaginii originale (.webp), relativ la host: /uploads/gallery/{guid}.webp</summary>
          [Required]
          [StringLength(500)]
          public string ImageUrl { get; set; } = string.Empty;

          /// <summary>URL-ul thumbnail-ului (300x300, .webp)</summary>
          [Required]
          [StringLength(500)]
          public string ThumbnailUrl { get; set; } = string.Empty;

          /// <summary>Dimensiunea în bytes a fișierului original procesat (post-WebP).</summary>
          public long FileSizeBytes { get; set; }

          public int Width { get; set; }
          public int Height { get; set; }

          /// <summary>Id-ul adminului care a făcut upload-ul. Referință logică la UDTable.Id (fără FK EF pentru a nu complica migrațiile).</summary>
          public int UploadedByUserId { get; set; }

          public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

          /// <summary>Pentru soft-hide fără ștergere fizică (ex. ascundere rapidă).</summary>
          public bool IsPublished { get; set; } = true;
     }
}
