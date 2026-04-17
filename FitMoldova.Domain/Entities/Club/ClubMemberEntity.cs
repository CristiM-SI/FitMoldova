using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;

namespace FitMoldova.Domain.Entities.Club
{
    /// <summary>
    /// Tabelă de joncțiune N-N: un User poate fi membru în multe Cluburi,
    /// un Club poate avea mulți Useri. Un rând = o apartenență.
    /// Unique constraint pe (ClubId, UserId) previne duplicatele.
    /// </summary>
    public class ClubMemberEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ClubId { get; set; }

        [ForeignKey(nameof(ClubId))]
        public ClubEntity Club { get; set; } = null!;

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public UDTable User { get; set; } = null!;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
