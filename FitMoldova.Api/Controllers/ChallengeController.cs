using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Challenge;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/challenge")]
public class ChallengeController : ControllerBase
{
     private readonly IChallengeLogic _challengeLogic;

     public ChallengeController()
     {
          var bl = new BusinessLogic();
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

     [HttpPost]
     public IActionResult Create([FromBody] ChallengeCreateDto dto)
     {
          var result = _challengeLogic.CreateChallenge(dto);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpPut("{id}")]
     public IActionResult Update(int id, [FromBody] ChallengeUpdateDto dto)
     {
          var result = _challengeLogic.UpdateChallenge(id, dto);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     [HttpPost("{id}/join/{userId}")]
     public IActionResult Join(int id, int userId)
     {
          var result = _challengeLogic.JoinChallenge(id, userId);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _challengeLogic.Delete(id);
          if (!result.isSuccess) return NotFound(result);
          return NoContent();
     }
}