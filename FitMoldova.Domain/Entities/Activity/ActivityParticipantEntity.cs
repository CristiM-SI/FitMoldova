using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;

namespace FitMoldova.Domain.Entities.Activity
{
    /// <summary>
    /// Tabelă de joncțiune: un User se poate alătura unei Activity.
    /// </summary>
    public class ActivityParticipantEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ActivityId { get; set; }

        [ForeignKey(nameof(ActivityId))]
        public ActivityEntity Activity { get; set; } = null!;

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public UDTable User { get; set; } = null!;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
