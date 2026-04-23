using Microsoft.EntityFrameworkCore;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Entities.Route;
using FitMoldova.Domain.Entities.Event;
using FitMoldova.Domain.Entities.Club;
using FitMoldova.Domain.Entities.Challenge;
using FitMoldova.Domain.Entities.Post;
using FitMoldova.Domain.Enums;
using FitMoldova.BusinessLogic.Core;
using FitMoldova.DataAccesLayer.Converters;

namespace FitMoldova.DataAccesLayer;

public class FitMoldovaContext : DbContext
{
    private readonly IEncryptionService? _encryption;

    // Constructor folosit de DI în runtime (Program.cs → AddDbContext)
    public FitMoldovaContext(DbContextOptions<FitMoldovaContext> options, IEncryptionService encryption)
        : base(options)
    {
        _encryption = encryption;
    }

    // Constructor folosit de EF Core Tools la design-time (dotnet ef migrations add ...)
    // La momentul migrării NU avem DI, deci criptarea e dezactivată — migrarea
    // creează doar schema. Vezi FitMoldovaContextFactory pentru setup.
    public FitMoldovaContext(DbContextOptions<FitMoldovaContext> options)
        : base(options)
    {
        _encryption = null;
    }

    public DbSet<UDTable> Users { get; set; }
    public DbSet<ActivityEntity> Activities { get; set; }
    public DbSet<ActivityParticipantEntity> ActivityParticipants { get; set; }
    public DbSet<RouteEntity> Routes { get; set; }
    public DbSet<RouteHighlightEntity> RouteHighlights { get; set; }
    public DbSet<RouteCoordEntity> RouteCoords { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    public DbSet<ClubEntity> Clubs { get; set; }
    public DbSet<ClubMemberEntity> ClubMembers { get; set; }
    public DbSet<ChallengeEntity> Challenges { get; set; }
    public DbSet<PostEntity> Posts { get; set; }
    public DbSet<PostReplyEntity> PostReplies { get; set; }
    public DbSet<EventParticipantEntity> EventParticipants { get; set; }
    public DbSet<ChallengeParticipantEntity> ChallengeParticipants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── User ──────────────────────────────────────────────────────────────
        modelBuilder.Entity<UDTable>()
            .HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<UDTable>()
            .HasIndex(u => u.Email).IsUnique();

        modelBuilder.Entity<UDTable>()
            .Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(UserRole.User);
        modelBuilder.Entity<EventParticipantEntity>()
             .HasIndex(ep => new { ep.EventId, ep.UserId }).IsUnique();

        modelBuilder.Entity<EventParticipantEntity>()
             .HasOne(ep => ep.Event)
             .WithMany(e => e.EventParticipants)
             .HasForeignKey(ep => ep.EventId)
             .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EventParticipantEntity>()
             .HasOne(ep => ep.User)
             .WithMany()
             .HasForeignKey(ep => ep.UserId)
             .OnDelete(DeleteBehavior.NoAction);

        // ── CRIPTARE PII (GDPR-sensitive fields) ──────────────────────────────
        // Aplicăm encryption doar dacă avem serviciul disponibil (runtime, nu design-time).
        if (_encryption is not null)
        {
            var encryptedConverter = new EncryptedStringConverter(_encryption);

            // Phone: plaintext max 20 chars → ciphertext Base64 ~70 chars.
            // Mărim la 200 ca să avem margine confortabilă pentru orice valori.
            modelBuilder.Entity<UDTable>()
                .Property(u => u.Phone)
                .HasConversion(encryptedConverter)
                .HasMaxLength(200);

            // Location: plaintext max 100 chars → ciphertext ~180 chars
            modelBuilder.Entity<UDTable>()
                .Property(u => u.Location)
                .HasConversion(encryptedConverter)
                .HasMaxLength(400);

            // Bio: plaintext max 500 chars → ciphertext ~720 chars
            modelBuilder.Entity<UDTable>()
                .Property(u => u.Bio)
                .HasConversion(encryptedConverter)
                .HasMaxLength(1000);
        }

        // ── Activity → User ───────────────────────────────────────────────────
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
            .OnDelete(DeleteBehavior.NoAction);

        // ── ClubMember → Club și User (N-N) ───────────────────────────────────
        modelBuilder.Entity<ClubMemberEntity>()
            .HasIndex(cm => new { cm.ClubId, cm.UserId }).IsUnique();

        modelBuilder.Entity<ClubMemberEntity>()
            .HasOne(cm => cm.Club)
            .WithMany(c => c.Members)
            .HasForeignKey(cm => cm.ClubId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ClubMemberEntity>()
            .HasOne(cm => cm.User)
            .WithMany()
            .HasForeignKey(cm => cm.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<RouteHighlightEntity>()
             .HasOne(h => h.Route)
             .WithMany(r => r.Highlights)
             .HasForeignKey(h => h.RouteId)
             .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<RouteCoordEntity>()
             .HasOne(c => c.Route)
             .WithMany(r => r.Path)
             .HasForeignKey(c => c.RouteId)
             .OnDelete(DeleteBehavior.Cascade);



        // ── Post → User ───────────────────────────────────────────────────────
        modelBuilder.Entity<PostEntity>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        //ChallengeParticipantEntity
        modelBuilder.Entity<ChallengeParticipantEntity>()
             .HasIndex(cp => new { cp.ChallengeId, cp.UserId }).IsUnique();
        modelBuilder.Entity<ChallengeParticipantEntity>()
             .HasOne(cp => cp.Challenge).WithMany()
             .HasForeignKey(cp => cp.ChallengeId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ChallengeParticipantEntity>()
             .HasOne(cp => cp.User).WithMany()
             .HasForeignKey(cp => cp.UserId).OnDelete(DeleteBehavior.NoAction);
    }
}
