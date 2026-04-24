using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitMoldova.Domain.Entities.User
{
    public class UserFollowEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int FollowerId { get; set; }
        public UDTable Follower { get; set; } = null!;

        public int FollowedId { get; set; }
        public UDTable Followed { get; set; } = null!;

        public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    }
}
