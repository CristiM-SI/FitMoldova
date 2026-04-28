using AutoMapper;
using FitMoldova.Api.Filters;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Challenge;
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

     // GET api/challenge — public
     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _challengeLogic.GetAll();
          return Ok(result);
     }

     // GET api/challenge/42 — public
     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _challengeLogic.GetById(id);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     // POST api/challenge/42/join — utilizator autentificat
     [HttpPost("{id}/join")]
     [UserMod]
     public IActionResult Join(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _challengeLogic.JoinChallenge(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     // DELETE api/challenge/42/leave — utilizator autentificat
     [HttpDelete("{id}/leave")]
     [UserMod]
     public IActionResult Leave(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _challengeLogic.LeaveChallenge(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     // PUT api/challenge/42 — doar Admin
     [HttpPut("{id}")]
     [AdminMod]
     public IActionResult Update(int id, [FromBody] ChallengeUpdateDto dto)
     {
          var result = _challengeLogic.UpdateChallenge(id, dto);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     // DELETE api/challenge/42 — doar Admin
     [HttpDelete("{id}")]
     [AdminMod]
     public IActionResult Delete(int id)
     {
          var result = _challengeLogic.Delete(id);
          if (!result.isSuccess) return NotFound(result);
          return NoContent();
     }
}
