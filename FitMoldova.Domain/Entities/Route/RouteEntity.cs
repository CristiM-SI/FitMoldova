using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Route
{
     public class RouteEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(100)]
          public string Name { get; set; } = string.Empty;

          [StringLength(20)]
          public string Type { get; set; } = string.Empty;

          [StringLength(20)]
          public string Difficulty { get; set; } = string.Empty;

          public double Distance { get; set; }
          public int EstimatedDuration { get; set; }
          public int ElevationGain { get; set; }
          public string Description { get; set; } = string.Empty;

          [StringLength(60)]
          public string Region { get; set; } = string.Empty;

          [StringLength(20)]
          public string Surface { get; set; } = string.Empty;

          public bool IsLoop { get; set; }
     }
}