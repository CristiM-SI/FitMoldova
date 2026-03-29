using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Activity
{
     public class ActivityEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          public int UserId { get; set; }

          [Required]
          [StringLength(100)]
          public string Name { get; set; } = string.Empty;

          [StringLength(30)]
          public string Type { get; set; } = string.Empty;

          [StringLength(20)]
          public string Distance { get; set; } = string.Empty;

          [StringLength(20)]
          public string Duration { get; set; } = string.Empty;

          public int Calories { get; set; }

          public DateTime Date { get; set; }
     }
}