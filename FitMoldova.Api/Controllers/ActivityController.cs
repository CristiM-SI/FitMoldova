using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Activity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/activity")]
[Authorize]
public class ActivityController : ControllerBase
{
    private readonly IActivityLogic _activityLogic;

    public ActivityController(IMapper mapper)
    {
        var bl = new BusinessLogic(mapper);
        _activityLogic = bl.ActivityLogic();
    }

    // GET api/activity — public
    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetAll()
    {
        var result = _activityLogic.GetAll();
        return Ok(result);
    }

    // GET api/activity/42 — public
    [HttpGet("{id}")]
    [AllowAnonymous]
    public IActionResult GetById(int id)
    {
        var result = _activityLogic.GetById(id);
        if (!result.isSuccess) return NotFound(result);
        return Ok(result);
    }

    // GET api/activity/joined — activitățile la care userul curent e înscris
    [HttpGet("joined")]
    public IActionResult GetJoined()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _activityLogic.GetJoinedByUser(userId);
        return Ok(result);
    }

    // POST api/activity
    [HttpPost]
    public IActionResult Create([FromBody] ActivityCreateDto dto)
    {
        var result = _activityLogic.CreateActivity(dto);
        if (!result.isSuccess) return BadRequest(result);
        return Ok(result);
    }

    // PUT api/activity/42
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] ActivityUpdateDto dto)
    {
        var result = _activityLogic.UpdateActivity(id, dto);
        if (!result.isSuccess) return NotFound(result);
        return Ok(result);
    }

    // DELETE api/activity/42
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var result = _activityLogic.Delete(id);
        if (!result.isSuccess) return NotFound(result);
        return NoContent();
    }

    // POST api/activity/42/join
    [HttpPost("{activityId}/join")]
    public IActionResult Join(int activityId)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _activityLogic.JoinActivity(activityId, userId);
        if (!result.isSuccess) return BadRequest(result);
        return Ok(result);
    }

    // DELETE api/activity/42/leave
    [HttpDelete("{activityId}/leave")]
    public IActionResult Leave(int activityId)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _activityLogic.LeaveActivity(activityId, userId);
        if (!result.isSuccess) return BadRequest(result);
        return Ok(result);
    }

    // GET api/activity/42/participants — public
    [HttpGet("{activityId}/participants")]
    [AllowAnonymous]
    public IActionResult GetParticipants(int activityId)
    {
        var result = _activityLogic.GetParticipants(activityId);
        if (!result.isSuccess) return NotFound(result);
        return Ok(result);
    }
}
