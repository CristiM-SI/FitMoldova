using System.Security.Cryptography;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.User;
using Microsoft.Extensions.Configuration;

namespace FitMoldova.BusinessLogic.Core
{
     public class RefreshTokenService
     {
          private readonly FitMoldovaContext _ctx;
          private readonly int _expiresInDays;

          public RefreshTokenService(FitMoldovaContext ctx, IConfiguration configuration)
          {
               _ctx = ctx;
               _expiresInDays = int.Parse(configuration.GetSection("Jwt")["RefreshExpiresInDays"] ?? "7");
          }

          public RefreshTokenEntity Generate(int userId)
          {
               var bytes = RandomNumberGenerator.GetBytes(64);
               var token = Convert.ToBase64String(bytes)
                    .Replace("+", "-").Replace("/", "_").TrimEnd('=');

               var entity = new RefreshTokenEntity
               {
                    UserId = userId,
                    Token = token,
                    ExpiresAt = DateTime.UtcNow.AddDays(_expiresInDays),
                    IsRevoked = false,
                    CreatedAt = DateTime.UtcNow
               };
               _ctx.RefreshTokens.Add(entity);
               _ctx.SaveChanges();
               return entity;
          }

          public RefreshTokenEntity? FindActive(string token)
          {
               var rt = _ctx.RefreshTokens.FirstOrDefault(t => t.Token == token);
               if (rt == null || rt.IsRevoked || rt.ExpiresAt <= DateTime.UtcNow)
                    return null;
               return rt;
          }

          public bool Revoke(string token)
          {
               var rt = _ctx.RefreshTokens.FirstOrDefault(t => t.Token == token);
               if (rt == null || rt.IsRevoked) return false;
               rt.IsRevoked = true;
               _ctx.SaveChanges();
               return true;
          }
     }
}
