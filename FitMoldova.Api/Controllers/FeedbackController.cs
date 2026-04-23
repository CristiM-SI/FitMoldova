using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Feedback;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

    // POST api/feedback
    // Utilizator autentificat trimite o recenzie
    [HttpPost]
    [Authorize]
    public IActionResult Submit([FromBody] FeedbackCreateDto dto)
    {
        var result = _feedbackLogic.Submit(dto);
        if (!result.isSuccess)
            return BadRequest(result);
        return Ok(result);
    }

    // GET api/feedback
    // Recenzii vizibile, pinned primele — public
    [HttpGet]
    public IActionResult GetAll()
    {
        var result = _feedbackLogic.GetAll();
        return Ok(result);
    }

    // GET api/feedback/admin
    // Toate recenziile inclusiv ascunse — doar admin
    [HttpGet("admin")]
    [Authorize]
    public IActionResult GetAllAdmin()
    {
        var result = _feedbackLogic.GetAllAdmin();
        return Ok(result);
    }

    // GET api/feedback/stats
    // Statistici globale — public
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        var result = _feedbackLogic.GetStats();
        return Ok(result);
    }

    // PUT api/feedback/42/status
    // Schimbă vizibilitatea — doar admin
    [HttpPut("{id}/status")]
    [Authorize]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var result = _feedbackLogic.UpdateStatus(id, request.Status);
        if (!result.isSuccess)
            return NotFound(result);
        return Ok(result);
    }

    // PUT api/feedback/42/pin
    // Toggle pin pentru pagina publică — doar admin
    [HttpPut("{id}/pin")]
    [Authorize]
    public IActionResult TogglePin(int id)
    {
        var result = _feedbackLogic.TogglePin(id);
        if (!result.isSuccess)
            return NotFound(result);
        return Ok(result);
    }

    // DELETE api/feedback/42
    // Șterge o recenzie — doar admin
    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult Delete(int id)
    {
        var result = _feedbackLogic.Delete(id);
        if (!result.isSuccess)
            return NotFound(result);
        return NoContent();
    }
}

public record UpdateStatusRequest(string Status);
