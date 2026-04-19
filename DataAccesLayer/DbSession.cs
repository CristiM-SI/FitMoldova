using Microsoft.EntityFrameworkCore;

namespace FitMoldova.DataAccesLayer
{
     public class DbSession
     {
          public FitMoldovaContext FitMoldovaContext()
          {
               var options = new DbContextOptionsBuilder<FitMoldovaContext>()
                    .UseNpgsql("Host=localhost;Port=5433;Database=FitMoldova;Username=postgres;Password=FitMD26;")
                    .Options;
               return new FitMoldovaContext(options);
          }
     }
}