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

     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _activityLogic.GetAll();
          return Ok(result);
     }

     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _activityLogic.GetById(id);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     [HttpPost]
     public IActionResult Create([FromBody] ActivityCreateDto dto)
     {
          var result = _activityLogic.CreateActivity(dto);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpPut("{id}")]
     public IActionResult Update(int id, [FromBody] ActivityUpdateDto dto)
     {
          var result = _activityLogic.UpdateActivity(id, dto);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _activityLogic.Delete(id);
          if (!result.isSuccess) return NotFound(result);
          return NoContent();
     }

     [HttpPost("{activityId}/join/{userId}")]
     public IActionResult Join(int activityId, int userId)
     {
          var result = _activityLogic.JoinActivity(activityId, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpGet("{activityId}/participants")]
     public IActionResult GetParticipants(int activityId)
     {
          var result = _activityLogic.GetParticipants(activityId);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }
}