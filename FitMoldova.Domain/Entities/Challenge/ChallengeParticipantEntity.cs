using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FitMoldova.Domain.Entities.Challenge;
using FitMoldova.Domain.Entities.User;


public class ChallengeParticipantEntity
{
     [Key][DatabaseGenerated(DatabaseGeneratedOption.Identity)]
     public int Id { get; set; }
     public int ChallengeId { get; set; }
     public ChallengeEntity Challenge { get; set; } = null!;
     public int UserId { get; set; }
     public UDTable User { get; set; } = null!;
     public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
}