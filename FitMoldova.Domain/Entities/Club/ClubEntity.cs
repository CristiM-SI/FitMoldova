using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Club
{
     public class ClubEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(80)]
          public string Name { get; set; } = string.Empty;

          [StringLength(30)]
          public string Category { get; set; } = string.Empty;

          [StringLength(100)]
          public string Location { get; set; } = string.Empty;

          public string Description { get; set; } = string.Empty;

          [StringLength(80)]
          public string Schedule { get; set; } = string.Empty;

          [StringLength(20)]
          public string Level { get; set; } = string.Empty;

          public double Rating { get; set; } = 0;
          
          public string ImageUrl { get; set; } = string.Empty;

          /// <summary>
          /// Navigation property N-N: lista apartenențelor.
          /// Numărul real de membri = Members.Count, calculat din DB.
          /// Nu mai ținem un counter int — sursa unică de adevăr e tabelul ClubMembers.
          /// </summary>
          public ICollection<ClubMemberEntity> Members { get; set; } = new List<ClubMemberEntity>();
     }
}