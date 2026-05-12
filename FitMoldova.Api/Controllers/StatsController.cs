using FitMoldova.DataAccesLayer;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// IMPORTANTA 4 FIX: endpoint /api/stats cu statistici reale din DB
/// Elimina necesitatea datelor hardcodate din Home.tsx
/// </summary>
[ApiController]
[Route("api/stats")]
public class StatsController : ControllerBase
{
    private readonly FitMoldovaContext _ctx;

    public StatsController(FitMoldovaContext ctx)
    {
        _ctx = ctx;
    }

    /// <summary>
    /// GET /api/stats
    /// Returneaza statistici agregate reale: utilizatori, km, evenimente, cluburi.
    /// Endpoint public — nu necesita autentificare.
    /// </summary>
    [HttpGet]
    public IActionResult Get()
    {
        var totalUsers  = _ctx.Users.Count(u => u.IsActive);
        var totalEvents = _ctx.Events.Count();
        var totalClubs  = _ctx.Clubs.Count();

        var allDistances = _ctx.Activities
             .Select(a => a.Distance)
             .ToList();
        var totalKm = allDistances
             .Sum(d => double.TryParse(d, out var km) ? km : 0);
        return Ok(new
        {
            totalUsers,
            totalKm =(int)Math.Round(totalKm),
            totalEvents,
            totalClubs,
        });
    }
}
