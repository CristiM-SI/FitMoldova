
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
     public DbSet<UDTable> Users { get; set; }
     public DbSet<ActivityEntity> Activities { get; set; }
     public DbSet<RouteEntity> Routes { get; set; }
     public DbSet<EventEntity> Events { get; set; }
     public DbSet<ClubEntity> Clubs { get; set; }
     public DbSet<ChallengeEntity> Challenges { get; set; }
     public DbSet<PostEntity> Posts { get; set; }
     public DbSet<PostReplyEntity> PostReplies { get; set; }
     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
     {
          if (!optionsBuilder.IsConfigured)
          {
               optionsBuilder.UseSqlServer(
                   "Server=localhost;Database=FitMoldovaDb;Trusted_Connection=True;TrustServerCertificate=True;");
          }
     }
}