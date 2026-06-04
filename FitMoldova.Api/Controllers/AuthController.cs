using System.Security.Cryptography;
using FitMoldova.BusinessLogic.Core;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using BC = BCrypt.Net.BCrypt;

namespace FitMoldova.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly FitMoldovaContext _ctx;
        private readonly JwtService _jwtService;
        private readonly RefreshTokenService _refreshTokenService;
        private readonly IEmailService _emailService;

        public AuthController(FitMoldovaContext ctx, JwtService jwtService, RefreshTokenService refreshTokenService, IEmailService emailService)
        {
            _ctx = ctx;
            _jwtService = jwtService;
            _refreshTokenService = refreshTokenService;
            _emailService = emailService;
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
                Secure   = Request.IsHttps,
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
                Secure   = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Path     = "/api/auth"
            });

            return Ok(new { message = "Logout reușit." });
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("auth-limit")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            // Răspuns generic indiferent dacă emailul există — nu dezvăluim conturile înregistrate.
            const string generic = "Dacă adresa de email există, vei primi un cod de resetare.";

            var user = _ctx.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null)
                return Ok(new { message = generic });

            // Invalidează codurile anterioare nefolosite ale userului.
            var previous = _ctx.PasswordResetCodes
                .Where(c => c.UserId == user.Id && !c.IsUsed)
                .ToList();
            foreach (var c in previous)
                c.IsUsed = true;

            // Cod random de 6 cifre, stocat doar ca hash BCrypt.
            var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");

            _ctx.PasswordResetCodes.Add(new PasswordResetCodeEntity
            {
                UserId    = user.Id,
                CodeHash  = BC.HashPassword(code),
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed    = false,
                CreatedAt = DateTime.UtcNow
            });
            _ctx.SaveChanges();

            // Eșecul trimiterii nu trebuie să dezvăluie existența contului → înghițim excepția.
            try
            {
                _emailService.SendPasswordResetCode(user.Email, code);
            }
            catch
            {
                // ignorăm intenționat — răspunsul rămâne generic
            }

            return Ok(new { message = generic });
        }

        [HttpPost("reset-password")]
        [EnableRateLimiting("auth-limit")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDto dto)
        {
            // newPassword este validată de [RegularExpression] pe DTO (ApiController → 400 automat).
            const string generic = "Cod invalid sau expirat.";

            var user = _ctx.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null)
                return BadRequest(new { message = generic });

            var resetCode = _ctx.PasswordResetCodes
                .Where(c => c.UserId == user.Id && !c.IsUsed && c.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefault();

            if (resetCode == null || !BC.Verify(dto.Code, resetCode.CodeHash))
                return BadRequest(new { message = generic });

            user.Password    = BC.HashPassword(dto.NewPassword);
            resetCode.IsUsed = true;
            _ctx.SaveChanges();

            // Revocă sesiunile active ale userului după schimbarea parolei.
            _refreshTokenService.RevokeAllForUser(user.Id);

            return Ok(new { message = "Parola a fost resetată cu succes." });
        }
    }
}
