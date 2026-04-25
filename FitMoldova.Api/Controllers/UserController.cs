using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IUserLogic _userLogic;
    private readonly JwtService _jwtService;

    public UserController(IUserLogic userLogic, JwtService jwtService)
    {
        _userLogic = userLogic;
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

        // CRITICA 3 FIX: cast direct la DTO tipat — zero reflexie
        var data = (UserLoginResultDto)result.Data!;

        var (token, expiresAt) = _jwtService.GenerateToken(
            data.Id, data.Email, data.Username, data.Role);

        return Ok(new
        {
            token,
            expiresAt,
            userId    = data.Id,
            username  = data.Username,
            firstName = data.FirstName,
            lastName  = data.LastName,
            email     = data.Email,
            role      = data.Role
        });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAll()
    {
        var result = _userLogic.GetAll();
        return Ok(result);
    }

    [HttpPatch("{id}/role")]
    [Authorize(Roles = "Admin")]
    public IActionResult ChangeRole(int id, [FromBody] ChangeRoleDto dto)
    {
        var result = _userLogic.ChangeRole(id, dto);
        if (!result.isSuccess) return BadRequest(result);
        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public IActionResult ChangeStatus(int id, [FromBody] ChangeStatusDto dto)
    {
        var result = _userLogic.ChangeStatus(id, dto);
        if (!result.isSuccess) return BadRequest(result);
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

    [HttpGet("profile")]
    [Authorize]
    public IActionResult GetProfile()
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _userLogic.GetProfile(userId);
        if (!result.isSuccess) return NotFound(result);
        return Ok(result);
    }

    [HttpPut("profile")]
    [Authorize]
    public IActionResult UpdateProfile([FromBody] UserUpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _userLogic.UpdateProfile(userId, dto);
        if (!result.isSuccess) return NotFound(result);
        return Ok(result);
    }

    [HttpGet("community")]
    public IActionResult GetCommunity()
    {
        var result = _userLogic.GetCommunity();
        return Ok(result);
    }

    [HttpPost("{id}/follow")]
    [Authorize]
    public IActionResult Follow(int id)
    {
        var followerId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _userLogic.Follow(followerId, id);
        if (!result.isSuccess) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("{id}/unfollow")]
    [Authorize]
    public IActionResult Unfollow(int id)
    {
        var followerId = int.Parse(User.FindFirst("userId")!.Value);
        var result = _userLogic.Unfollow(followerId, id);
        if (!result.isSuccess) return BadRequest(result);
        return Ok(result);
    }
}
