using FitMoldova.BusinessLogic.Core;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace FitMoldova.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly FitMoldovaContext _ctx;
        private readonly JwtService _jwtService;
        private readonly RefreshTokenService _refreshTokenService;

        public AuthController(FitMoldovaContext ctx, JwtService jwtService, RefreshTokenService refreshTokenService)
        {
            _ctx = ctx;
            _jwtService = jwtService;
            _refreshTokenService = refreshTokenService;
        }

        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] RefreshTokenRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RefreshToken))
                return BadRequest(new { message = "Refresh token lipsește." });

            var stored = _refreshTokenService.FindActive(dto.RefreshToken);
            if (stored == null)
                return Unauthorized(new { message = "Refresh token invalid sau expirat." });

            var user = _ctx.Users.FirstOrDefault(u => u.Id == stored.UserId);
            if (user == null || !user.IsActive)
                return Unauthorized(new { message = "Utilizator inactiv sau inexistent." });

            var (token, expiresAt) = _jwtService.GenerateToken(
                user.Id, user.Email, user.Username, user.Role.ToString());

            return Ok(new
            {
                token,
                expiresAt,
                userId = user.Id
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromBody] RefreshTokenRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RefreshToken))
                return BadRequest(new { message = "Refresh token lipsește." });

            var revoked = _refreshTokenService.Revoke(dto.RefreshToken);
            if (!revoked)
                return NotFound(new { message = "Refresh token inexistent sau deja revocat." });

            return Ok(new { message = "Logout reușit." });
        }
    }
}
