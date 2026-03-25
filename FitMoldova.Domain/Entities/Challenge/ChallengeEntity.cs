using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Challenge
{
     public class ChallengeEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(80)]
          public string Name { get; set; } = string.Empty;

          public string Description { get; set; } = string.Empty;

          [StringLength(20)]
          public string Duration { get; set; } = string.Empty;

          [StringLength(10)]
          public string Difficulty { get; set; } = string.Empty;

          public int Participants { get; set; } = 0;
     }
}