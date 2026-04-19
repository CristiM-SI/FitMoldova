using Microsoft.EntityFrameworkCore;

namespace FitMoldova.DataAccesLayer
{
     public class DbSession
     {
          public static string? ConnectionString { get; set; }

          public FitMoldovaContext FitMoldovaContext()
          {
               var cs = ConnectionString;
               if (string.IsNullOrWhiteSpace(cs))
                    throw new System.InvalidOperationException(
                         "DbSession.ConnectionString nu e setat. Verifică Program.cs și user-secrets.");

               var options = new DbContextOptionsBuilder<FitMoldovaContext>()
                    .UseNpgsql(cs)
                    .Options;
               return new FitMoldovaContext(options);
          }
     }
}