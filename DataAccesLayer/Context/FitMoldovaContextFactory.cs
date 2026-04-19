using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FitMoldova.DataAccesLayer
{
     public class FitMoldovaContextFactory : IDesignTimeDbContextFactory<FitMoldovaContext>
     {
          public FitMoldovaContext CreateDbContext(string[] args)
          {
               var options = new DbContextOptionsBuilder<FitMoldovaContext>()
                    .UseNpgsql("Host=localhost;Port=5433;Database=FitMoldova;Username=postgres;Password=FitMD26;")
                    .Options;

               return new FitMoldovaContext(options);
          }
     }
}