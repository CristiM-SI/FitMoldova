using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Route
{
     public class RouteHighlightEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          public int RouteId { get; set; }

          [ForeignKey(nameof(RouteId))]
          public RouteEntity Route { get; set; } = null!;

          [Required]
          [StringLength(100)]
          public string Text { get; set; } = string.Empty;

          public int Order { get; set; }
     }
}