using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Club;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/club")]
public class ClubController : ControllerBase
{
     private readonly IClubLogic _clubLogic;

     public ClubController()
     {
          var bl = new BusinessLogic();
          _clubLogic = bl.ClubLogic();
     }

    
     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _clubLogic.GetAll();
          return Ok(result);
     }

    
     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _clubLogic.GetById(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     [HttpPost]
     public IActionResult Create([FromBody] ClubCreateDto dto)
     {
          var result = _clubLogic.CreateClub(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     [HttpPost("{id}/join/{userId}")]
     public IActionResult Join(int id, int userId)
     {
          var result = _clubLogic.JoinClub(id, userId);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

  
     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _clubLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
}