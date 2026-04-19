using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace FitMoldova.DataAccesLayer
{
     public class FitMoldovaContextFactory : IDesignTimeDbContextFactory<FitMoldovaContext>
     {
          public FitMoldovaContext CreateDbContext(string[] args)
          {
               var apiPath = Path.GetFullPath(
                    Path.Combine(Directory.GetCurrentDirectory(), "..", "FitMoldova.Api"));

               var config = new ConfigurationBuilder()
                    .SetBasePath(apiPath)
                    .AddJsonFile("appsettings.json", optional: false)
                    .AddJsonFile("appsettings.Development.json", optional: true)
                    .AddUserSecrets<FitMoldovaContextFactory>()
                    .AddEnvironmentVariables()
                    .Build();

               var cs = config.GetConnectionString("DefaultConnection");
               if (string.IsNullOrWhiteSpace(cs))
                    throw new System.InvalidOperationException(
                         "ConnectionStrings:DefaultConnection nu e setat. " +
                         "Rulează: dotnet user-secrets set \"ConnectionStrings:DefaultConnection\" \"...\" în FitMoldova.Api.");

               var options = new DbContextOptionsBuilder<FitMoldovaContext>()
                    .UseNpgsql(cs)
                    .Options;

               return new FitMoldovaContext(options);
          }
     }
}