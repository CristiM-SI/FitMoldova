using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Challenge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/challenge")]
public class ChallengeController : ControllerBase
{
     private readonly IChallengeLogic _challengeLogic;

     public ChallengeController(IMapper mapper)
     {
          var bl = new FitMoldova.BusinessLogic.BusinessLogic(mapper);
          _challengeLogic = bl.ChallengeLogic();
     }

     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _challengeLogic.GetAll();
          return Ok(result);
     }

     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _challengeLogic.GetById(id);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     [HttpPost("{id}/join")]
     [Authorize]
     public IActionResult Join(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _challengeLogic.JoinChallenge(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpPut("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Update(int id, [FromBody] ChallengeUpdateDto dto)
     {
          var result = _challengeLogic.UpdateChallenge(id, dto);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }
     
     [HttpDelete("{id}/leave")]
     [Authorize]
     public IActionResult Leave(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _challengeLogic.LeaveChallenge(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpDelete("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Delete(int id)
     {
          var result = _challengeLogic.Delete(id);
          if (!result.isSuccess) return NotFound(result);
          return NoContent();
     }
}