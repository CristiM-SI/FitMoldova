// ACCESS CONTROL SUMMARY:
// Public:             GET /api/feedback, GET /api/feedback/stats
// [Authorize]:        POST /api/feedback (submit review, max 5/hour per IP)
// [Authorize(Admin)]: GET /api/feedback/admin, PUT /api/feedback/{id}/status,
//                     PUT /api/feedback/{id}/pin, DELETE /api/feedback/{id}
using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Feedback;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackLogic _feedbackLogic;

    public FeedbackController(IMapper mapper)
    {
        var bl = new BusinessLogic(mapper);
        _feedbackLogic = bl.FeedbackLogic();
    }

    // POST api/feedback — authenticated, rate-limited
    [HttpPost]
    [Authorize]
    [EnableRateLimiting("ContactFormPolicy")]
    public IActionResult Submit([FromBody] FeedbackCreateDto dto)
    {
        var result = _feedbackLogic.Submit(dto);
        if (!result.isSuccess)
            return BadRequest(result);
        return Ok(result);
    }

    // GET api/feedback — public
    [HttpGet]
    public IActionResult GetAll()
    {
        var result = _feedbackLogic.GetAll();
        return Ok(result);
    }

    // GET api/feedback/admin — admin only
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAllAdmin()
    {
        var result = _feedbackLogic.GetAllAdmin();
        return Ok(result);
    }

    // GET api/feedback/stats — public
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        var result = _feedbackLogic.GetStats();
        return Ok(result);
    }

    // PUT api/feedback/{id}/status — admin only
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var result = _feedbackLogic.UpdateStatus(id, request.Status);
        if (!result.isSuccess)
            return NotFound(result);
        return Ok(result);
    }

    // PUT api/feedback/{id}/pin — admin only
    [HttpPut("{id}/pin")]
    [Authorize(Roles = "Admin")]
    public IActionResult TogglePin(int id)
    {
        var result = _feedbackLogic.TogglePin(id);
        if (!result.isSuccess)
            return NotFound(result);
        return Ok(result);
    }

    // DELETE api/feedback/{id} — admin only
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(int id)
    {
        var result = _feedbackLogic.Delete(id);
        if (!result.isSuccess)
            return NotFound(result);
        return NoContent();
    }
}

public record UpdateStatusRequest(string Status);
