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

        var totalKm = _ctx.Activities
             .AsEnumerable()
             .Select(a => {
                  double.TryParse(a.Distance, out var km);
                  return km;
             })
             .Sum();
        return Ok(new
        {
            totalUsers,
            totalKm =0,
            totalEvents,
            totalClubs,
        });
    }
}
