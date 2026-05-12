using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.User;

namespace FitMoldova.Domain.Entities.Post
{
    public class PostPollVoteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }
        public UDTable User { get; set; } = null!;

        public int PostId { get; set; }
        public PostEntity Post { get; set; } = null!;

        public int OptionIndex { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
