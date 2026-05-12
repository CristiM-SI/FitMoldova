using FitMoldova.BusinessLogic.Core;
using FitMoldova.DataAccesLayer;
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
        public IActionResult Refresh()
        {
            var refreshToken = Request.Cookies["fitmoldova_refresh"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "Refresh token lipsă." });

            var stored = _refreshTokenService.FindActive(refreshToken);
            if (stored == null)
                return Unauthorized(new { message = "Refresh token invalid sau expirat." });

            var user = _ctx.Users.FirstOrDefault(u => u.Id == stored.UserId);
            if (user == null || !user.IsActive)
                return Unauthorized(new { message = "Utilizator inactiv sau inexistent." });

            _refreshTokenService.Revoke(refreshToken);
            var newRefreshToken = _refreshTokenService.Generate(user.Id);

            Response.Cookies.Append("fitmoldova_refresh", newRefreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure   = true,
                SameSite = SameSiteMode.Strict,
                Path     = "/api/auth",
                Expires  = newRefreshToken.ExpiresAt
            });

            var (token, expiresAt) = _jwtService.GenerateToken(
                user.Id, user.Email, user.Username, user.Role.ToString());

            return Ok(new { token, expiresAt });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var refreshToken = Request.Cookies["fitmoldova_refresh"];
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token lipsește." });

            var revoked = _refreshTokenService.Revoke(refreshToken);
            if (!revoked)
                return NotFound(new { message = "Refresh token inexistent sau deja revocat." });

            Response.Cookies.Delete("fitmoldova_refresh", new CookieOptions
            {
                HttpOnly = true,
                Secure   = true,
                SameSite = SameSiteMode.Strict,
                Path     = "/api/auth/refresh"
            });

            return Ok(new { message = "Logout reușit." });
        }
    }
}
