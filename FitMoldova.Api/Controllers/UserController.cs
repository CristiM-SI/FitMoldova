using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
     private readonly IUserLogic _userLogic;
     private readonly JwtService _jwtService;

     public UserController(JwtService jwtService)
     {
          var bl = new BusinessLogic();
          _userLogic = bl.UserLogic();
          _jwtService = jwtService;
     }

     [HttpPost("register")]
     public IActionResult Register([FromBody] UserCreateDto dto)
     {
          var result = _userLogic.Register(dto);
          if (!result.isSuccess) return BadRequest(result);
          return StatusCode(201, result);
     }

     [HttpPost("login")]
     public IActionResult Login([FromBody] UserLoginDto dto)
     {
          var result = _userLogic.Login(dto);
          if (!result.isSuccess) return Unauthorized(result);

          var data = result.Data!;
          var type = data.GetType();
          var id = (int)type.GetProperty("Id")!.GetValue(data)!;
          var email = (string)type.GetProperty("Email")!.GetValue(data)!;
          var username = (string)type.GetProperty("Username")!.GetValue(data)!;
          var role = (string)type.GetProperty("Role")!.GetValue(data)!;
          var firstName = (string)type.GetProperty("FirstName")!.GetValue(data)!;
          var lastName = (string)type.GetProperty("LastName")!.GetValue(data)!;
          
          var (token, expiresAt) = _jwtService.GenerateToken(id, email, username, role);
          
          return Ok(new
          {
               token, 
               expiresAt,
               userId = id,
               username,
               firstName,
               lastName,
               email,
               role
          });
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