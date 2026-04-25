using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Event;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/event")]
public class EventController : ControllerBase
{
     private readonly IEventLogic _eventLogic;

     public EventController(IMapper mapper)
     {
          var bl = new BusinessLogic(mapper);
          _eventLogic = bl.EventLogic();
     }

 
     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _eventLogic.GetAll();
          return Ok(result);
     }


     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _eventLogic.GetById(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }


     [HttpPost]
     [Authorize(Roles = "Admin")]
     public IActionResult Create([FromBody] EventCreateDto dto)
     {
          var result = _eventLogic.CreateEvent(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }


     [HttpPut("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Update(int id, [FromBody] EventCreateDto dto)
     {
          var result = _eventLogic.UpdateEvent(id, dto);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     [HttpPost("{id}/join")]
     [Authorize]
     public IActionResult Join(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _eventLogic.JoinEvent(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }


    
     [HttpDelete("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Delete(int id)
     {
          var result = _eventLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
     
     [HttpDelete("{id}/leave")]
     [Authorize]
     public IActionResult Leave(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _eventLogic.LeaveEvent(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpGet("{id}/isParticipant")]
     [Authorize]
     public IActionResult IsParticipant(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _eventLogic.IsParticipant(id, userId);
          return Ok(result);
     }
}