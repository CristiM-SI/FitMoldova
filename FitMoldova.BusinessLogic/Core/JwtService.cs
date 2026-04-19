using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FitMoldova.BusinessLogic.Core
{
     public class JwtService
     {
          private readonly IConfiguration _configuration;

          public JwtService(IConfiguration configuration)
          {
               _configuration = configuration;
          }

          public (string token, DateTime expiresAt) GenerateToken(int userId, string email, string username, string role)
          {
               var jwtSettings = _configuration.GetSection("Jwt");
               var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
               var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
               var expiresMinutes = int.Parse(jwtSettings["ExpiresInMinutes"] ?? "1440");
               var expiresAt = DateTime.UtcNow.AddMinutes(expiresMinutes);

               var claims = new[]
               {
                    new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                    new Claim("userId", userId.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, email),
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, role.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
               };

               var token = new JwtSecurityToken(
                    issuer: jwtSettings["Issuer"],
                    audience: jwtSettings["Audience"],
                    claims: claims,
                    expires: expiresAt,
                    signingCredentials: credentials
               );

               return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
          }
     }
}