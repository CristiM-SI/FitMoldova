using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Route
{
     public class RouteCoordEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          public int RouteId { get; set; }

          [ForeignKey(nameof(RouteId))]
          public RouteEntity Route { get; set; } = null!;

          public double Lat { get; set; }
          public double Lng { get; set; }
          public int Order { get; set; }
     }
}