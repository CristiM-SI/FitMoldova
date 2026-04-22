using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Event;
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
     public IActionResult Create([FromBody] EventCreateDto dto)
     {
          var result = _eventLogic.CreateEvent(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }


     [HttpPut("{id}")]
     public IActionResult Update(int id, [FromBody] EventCreateDto dto)
     {
          var result = _eventLogic.UpdateEvent(id, dto);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     [HttpPost("{id}/join/{userId}")]
     public IActionResult Join(int id, int userId)
     {
          var result = _eventLogic.JoinEvent(id, userId);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

    
     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _eventLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
     
     [HttpDelete("{id}/leave/{userId}")]
     public IActionResult Leave(int id, int userId)
     {
          var result = _eventLogic.LeaveEvent(id, userId);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     [HttpGet("{id}/isParticipant/{userId}")]
     public IActionResult IsParticipant(int id, int userId)
     {
          var result = _eventLogic.IsParticipant(id, userId);
          return Ok(result);
     }
}