using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Feedback
{
    public class FeedbackEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        /// Rating 1–5
        public int Rating { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(3000)]
        public string Message { get; set; } = string.Empty;

        /// Categorii serializate ca JSON array (ex: ["Interfață (UX)","Performanță"])
        public string CategoriesJson { get; set; } = "[]";

        /// "vizibil" | "ascuns"
        [StringLength(20)]
        public string Status { get; set; } = "vizibil";

        public bool IsPinned { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
