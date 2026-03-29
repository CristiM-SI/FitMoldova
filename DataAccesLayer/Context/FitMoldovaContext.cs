using Microsoft.EntityFrameworkCore;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Entities.Route;
using FitMoldova.Domain.Entities.Event;
using FitMoldova.Domain.Entities.Club;
using FitMoldova.Domain.Entities.Challenge;
using FitMoldova.Domain.Entities.Post;

public class FitMoldovaContext : DbContext
{
     public FitMoldovaContext(DbContextOptions<FitMoldovaContext> options)
          : base(options) { }

     public DbSet<UDTable> Users { get; set; }
     public DbSet<ActivityEntity> Activities { get; set; }
     public DbSet<RouteEntity> Routes { get; set; }
     public DbSet<EventEntity> Events { get; set; }
     public DbSet<ClubEntity> Clubs { get; set; }
     public DbSet<ChallengeEntity> Challenges { get; set; }
     public DbSet<PostEntity> Posts { get; set; }
     public DbSet<PostReplyEntity> PostReplies { get; set; }

     protected override void OnModelCreating(ModelBuilder modelBuilder)
     {
          modelBuilder.Entity<ActivityEntity>()
               .HasOne(a => a.User)
               .WithMany(u => u.Activities)
               .HasForeignKey(a => a.UserId)
               .OnDelete(DeleteBehavior.Cascade);

          modelBuilder.Entity<PostEntity>()
               .HasOne(p => p.User)
               .WithMany(u => u.Posts)
               .HasForeignKey(p => p.UserId)
               .OnDelete(DeleteBehavior.Cascade);

          modelBuilder.Entity<UDTable>()
               .HasIndex(u => u.Username).IsUnique();
          modelBuilder.Entity<UDTable>()
               .HasIndex(u => u.Email).IsUnique();
     }
}    