using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Activity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/activity")]
public class ActivityController : ControllerBase
{
    private readonly IActivityLogic _activityLogic;

    public ActivityController()
    {
        var bl = new BusinessLogic();
        _activityLogic = bl.ActivityLogic();
    }

    /// <summary>
    /// Pagina principală — toți userii văd toate activitățile.
    /// </summary>
    [HttpGet]
    public IActionResult GetAll()
    {
        var result = _activityLogic.GetAll();
        return Ok(result);
    }

    /// <summary>
    /// Detalii despre o activitate specifică.
    /// </summary>
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var result = _activityLogic.GetById(id);
        if (!result.isSuccess)
            return NotFound(result);
        return Ok(result);
    }

    /// <summary>
    /// Creează o activitate nouă — doar admin (verificat prin creatorId).
    /// Body: { creatorId, name, type, distance, duration, calories, date, description, imageUrl }
    /// </summary>
    [HttpPost]
    public IActionResult Create([FromBody] ActivityCreateDto dto)
    {
        var result = _activityLogic.CreateActivity(dto);
        if (!result.isSuccess)
            return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Șterge o activitate — doar admin.
    /// </summary>
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _activityLogic.Delete(id);
        if (!result.isSuccess)
            return NotFound(result);
        return NoContent();
    }

    /// <summary>
    /// Un user se alătură unei activități.
    /// </summary>
    [HttpPost("{activityId}/join/{userId}")]
    public IActionResult Join(int activityId, int userId)
    {
        var result = _activityLogic.JoinActivity(activityId, userId);
        if (!result.isSuccess)
            return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// Lista participanților la o activitate.
    /// </summary>
    [HttpGet("{activityId}/participants")]
    public IActionResult GetParticipants(int activityId)
    {
        var result = _activityLogic.GetParticipants(activityId);
        if (!result.isSuccess)
            return NotFound(result);
        return Ok(result);
    }
}