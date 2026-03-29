using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
     private readonly IUserLogic _userLogic;

     public UserController()
     {
          var bl = new BusinessLogic();
          _userLogic = bl.UserLogic();
     }

     [HttpPost("register")]
     public IActionResult Register([FromBody] UserCreateDto dto)
     {
          var result = _userLogic.Register(dto);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpPost("login")]
     public IActionResult Login([FromBody] UserLoginDto dto)
     {
          var result = _userLogic.Login(dto);
          if (!result.isSuccess) return Unauthorized(result);
          return Ok(result);
     }

     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _userLogic.GetById(id);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     [HttpPut("{id}")]
     public IActionResult Update(int id, [FromBody] UserUpdateDto dto)
     {
          var result = _userLogic.Update(id, dto);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _userLogic.Delete(id);
          if (!result.isSuccess) return NotFound(result);
          return NoContent();
     }
}