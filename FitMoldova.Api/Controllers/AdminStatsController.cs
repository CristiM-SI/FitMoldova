using FitMoldova.Api.Filters;
using FitMoldova.DataAccesLayer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitMoldova.Api.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [AdminMod]
    public class AdminStatsController : ControllerBase
    {
        private readonly FitMoldovaContext _ctx;

        public AdminStatsController(FitMoldovaContext ctx)
        {
            _ctx = ctx;
        }
        
        [HttpGet("stats")]
        public async Task<IActionResult> GetAdminStats()
        {
            var now = DateTime.UtcNow;
            var sevenDaysAgo = now.AddDays(-7);
            var thirtyDaysAgo = now.AddDays(-30);

            // ── Utilizatori ───────────────────────────────────────────────────
            var totalUsers        = await _ctx.Users.CountAsync();
            var activeUsers       = await _ctx.Users.CountAsync(u => u.IsActive);
            var inactiveUsers     = totalUsers - activeUsers;
            var newUsersLast7Days = await _ctx.Users.CountAsync(u => u.CreatedAt >= sevenDaysAgo);
            var newUsersLast30Days= await _ctx.Users.CountAsync(u => u.CreatedAt >= thirtyDaysAgo);

            // Utilizatori recent activi (LastLoginAt în ultimele 30 zile)
            var recentlyActiveUsers = await _ctx.Users.CountAsync(
                u => u.IsActive && u.LastLoginAt != null && u.LastLoginAt >= thirtyDaysAgo);

            // Top roluri
            var usersByRole = await _ctx.Users
                .GroupBy(u => u.Role)
                .Select(g => new { Role = g.Key.ToString(), Count = g.Count() })
                .ToListAsync();

            // ── Activități ────────────────────────────────────────────────────
            var totalActivities = await _ctx.Activities.CountAsync();

            var allDistances = await _ctx.Activities
                .Select(a => a.Distance)
                .ToListAsync();
            var totalKm = (int)Math.Round(
                allDistances.Sum(d => double.TryParse(d, out var km) ? km : 0));

            // Top tipuri de activitate
            var topActivityTypes = await _ctx.Activities
                .GroupBy(a => a.Type)
                .OrderByDescending(g => g.Count())
                .Take(5)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToListAsync();

            var activitiesLast7Days = await _ctx.Activities
                .CountAsync(a => a.CreatedAt >= sevenDaysAgo);

            // ── Evenimente ────────────────────────────────────────────────────
            var totalEvents   = await _ctx.Events.CountAsync();
            var upcomingEvents = await _ctx.Events.CountAsync(e => e.Date > now);
            var pastEvents    = totalEvents - upcomingEvents;

            // Participanți totali la evenimente
            var totalEventParticipants = await _ctx.EventParticipants.CountAsync();

            // ── Cluburi ───────────────────────────────────────────────────────
            var totalClubs        = await _ctx.Clubs.CountAsync();
            var totalClubMembers  = await _ctx.ClubMembers.CountAsync();

            // ── Postări ───────────────────────────────────────────────────────
            var totalPosts        = await _ctx.Posts.CountAsync(p => !p.IsDeleted);
            var postsLast7Days    = await _ctx.Posts
                .CountAsync(p => !p.IsDeleted && p.CreatedAt >= sevenDaysAgo);

            // ── Provocări ─────────────────────────────────────────────────────
            var totalChallenges   = await _ctx.Challenges.CountAsync();
            var totalChallengeParticipants = await _ctx.ChallengeParticipants.CountAsync();

            // ── Rute ──────────────────────────────────────────────────────────
            var totalRoutes       = await _ctx.Routes.CountAsync();

            // ── Mesaje private ────────────────────────────────────────────────
            var totalMessages     = await _ctx.PrivateMessages.CountAsync();

            // ── Feedback-uri nerezolvate ───────────────────────────────────────
            var totalFeedbacks    = await _ctx.Feedbacks.CountAsync();

            // ── Răspuns complet ───────────────────────────────────────────────
            return Ok(new
            {
                generatedAt = now,

                users = new
                {
                    total          = totalUsers,
                    active         = activeUsers,
                    inactive       = inactiveUsers,
                    recentlyActive = recentlyActiveUsers,
                    newLast7Days   = newUsersLast7Days,
                    newLast30Days  = newUsersLast30Days,
                    byRole         = usersByRole
                },

                activities = new
                {
                    total        = totalActivities,
                    totalKm,
                    last7Days    = activitiesLast7Days,
                    topTypes     = topActivityTypes
                },

                events = new
                {
                    total        = totalEvents,
                    upcoming     = upcomingEvents,
                    past         = pastEvents,
                    totalParticipants = totalEventParticipants
                },

                clubs = new
                {
                    total        = totalClubs,
                    totalMembers = totalClubMembers
                },

                posts = new
                {
                    total        = totalPosts,
                    last7Days    = postsLast7Days
                },

                challenges = new
                {
                    total        = totalChallenges,
                    totalParticipants = totalChallengeParticipants
                },

                routes = new
                {
                    total        = totalRoutes
                },

                messages = new
                {
                    total        = totalMessages
                },

                feedbacks = new
                {
                    total        = totalFeedbacks
                }
            });
        }
    }
}
