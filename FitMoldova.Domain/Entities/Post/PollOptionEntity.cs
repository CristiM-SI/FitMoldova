using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.Post
{
     // O opțiune dintr-un sondaj. VotesCount e incrementat la fiecare vot valid.
     public class PollOptionEntity
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          public int PollId { get; set; }

          [ForeignKey(nameof(PollId))]
          public PollEntity Poll { get; set; } = null!;

          [Required]
          [StringLength(200)]
          public string Text { get; set; } = string.Empty;

          public int VotesCount { get; set; } = 0;
     }
}
