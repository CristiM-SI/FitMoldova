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

     
     [HttpPost]
     public IActionResult Create([FromBody] ActivityCreateDto dto)
     {
          var result = _activityLogic.CreateActivity(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     [HttpGet("user/{userId}")]
     public IActionResult GetByUser(int userId)
     {
          var result = _activityLogic.GetByUser(userId);
          return Ok(result);
     }

    
     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _activityLogic.GetById(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

   
     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _activityLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
}