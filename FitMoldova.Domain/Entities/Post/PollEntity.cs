using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Post
{
     // Sondaj opțional atașat unei postări (relație 1:0..1: o postare are cel mult un Poll).
     public class PollEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          public int PostId { get; set; }

          [ForeignKey(nameof(PostId))]
          public PostEntity Post { get; set; } = null!;

          [StringLength(280)]
          public string? Question { get; set; }

          public ICollection<PollOptionEntity> Options { get; set; } = new List<PollOptionEntity>();
     }
}
