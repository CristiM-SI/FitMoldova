using Microsoft.EntityFrameworkCore;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Entities.Route;
using FitMoldova.Domain.Entities.Event;
using FitMoldova.Domain.Entities.Club;
using FitMoldova.Domain.Entities.Challenge;
using FitMoldova.Domain.Entities.Post;
using FitMoldova.Domain.Enums;
namespace FitMoldova.DataAccesLayer; 

public class FitMoldovaContext : DbContext
{
    public FitMoldovaContext(DbContextOptions<FitMoldovaContext> options)
        : base(options) { }

    public DbSet<UDTable> Users { get; set; }
    public DbSet<ActivityEntity> Activities { get; set; }
    public DbSet<ActivityParticipantEntity> ActivityParticipants { get; set; }
    public DbSet<RouteEntity> Routes { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    public DbSet<ClubEntity> Clubs { get; set; }
    public DbSet<ChallengeEntity> Challenges { get; set; }
    public DbSet<PostEntity> Posts { get; set; }
    public DbSet<PostReplyEntity> PostReplies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── User ──────────────────────────────────────────────────────────────
        modelBuilder.Entity<UDTable>()
            .HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<UDTable>()
            .HasIndex(u => u.Email).IsUnique();

        // Stochează enum-ul UserRole ca string în DB
        modelBuilder.Entity<UDTable>()
            .Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(UserRole.User);

        // ── Activity → User (UserId, ca în migrația originală) ────────────────
        modelBuilder.Entity<ActivityEntity>()
            .HasOne(a => a.User)
            .WithMany(u => u.Activities)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ── ActivityParticipant → Activity și User ────────────────────────────
        modelBuilder.Entity<ActivityParticipantEntity>()
            .HasIndex(ap => new { ap.ActivityId, ap.UserId }).IsUnique();

        modelBuilder.Entity<ActivityParticipantEntity>()
            .HasOne(ap => ap.Activity)
            .WithMany(a => a.Participants)
            .HasForeignKey(ap => ap.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ActivityParticipantEntity>()
            .HasOne(ap => ap.User)
            .WithMany()
            .HasForeignKey(ap => ap.UserId)
            .OnDelete(DeleteBehavior.NoAction); // NoAction pentru a evita multiple cascade paths

        // ── Post → User ───────────────────────────────────────────────────────
        modelBuilder.Entity<PostEntity>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}