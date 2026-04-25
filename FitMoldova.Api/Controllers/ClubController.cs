using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Club;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/club")]
public class ClubController : ControllerBase
{
     private readonly IClubLogic _clubLogic;

     public ClubController(IMapper mapper)
     {
          var bl = new FitMoldova.BusinessLogic.BusinessLogic(mapper);
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
     [Authorize]
     public IActionResult Create([FromBody] ClubCreateDto dto)
     {
          var result = _clubLogic.CreateClub(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     [HttpPut("{id}")]
     public IActionResult Update(int id, [FromBody] ClubUpdateDto dto)
     {
          var result = _clubLogic.UpdateClub(id, dto);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     [HttpPost("{id}/join")]
     [Authorize]
     public IActionResult Join(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _clubLogic.JoinClub(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpDelete("{id}/leave")]
     [Authorize]
     public IActionResult Leave(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _clubLogic.LeaveClub(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpGet("{id}/members")]
     public IActionResult GetMembers(int id)
     {
          var result = _clubLogic.GetMembers(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     [HttpGet("user/{userId}")]
     public IActionResult GetUserClubs(int userId)
     {
          var result = _clubLogic.GetUserClubs(userId);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     [HttpDelete("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Delete(int id)
     {
          var result = _clubLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
}
