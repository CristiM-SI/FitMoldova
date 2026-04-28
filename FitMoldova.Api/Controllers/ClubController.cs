using AutoMapper;
using FitMoldova.Api.Filters;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Club;
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

     // GET api/club — public, orice vizitator
     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _clubLogic.GetAll();
          return Ok(result);
     }

     // GET api/club/42 — public
     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _clubLogic.GetById(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     // POST api/club — doar Admin poate crea cluburi
     [HttpPost]
     [AdminMod]
     public IActionResult Create([FromBody] ClubCreateDto dto)
     {
          var result = _clubLogic.CreateClub(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     // PUT api/club/42 — doar Admin poate modifica
     [HttpPut("{id}")]
     [AdminMod]
     public IActionResult Update(int id, [FromBody] ClubUpdateDto dto)
     {
          var result = _clubLogic.UpdateClub(id, dto);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     // POST api/club/42/join — orice utilizator autentificat
     [HttpPost("{id}/join")]
     [UserMod]
     public IActionResult Join(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _clubLogic.JoinClub(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     // POST api/club/42/leave — orice utilizator autentificat
     [HttpPost("{id}/leave")]
     [UserMod]
     public IActionResult Leave(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _clubLogic.LeaveClub(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     // DELETE api/club/42 — doar Admin
     [HttpDelete("{id}")]
     [AdminMod]
     public IActionResult Delete(int id)
     {
          var result = _clubLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
}
