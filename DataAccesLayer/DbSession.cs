using Microsoft.EntityFrameworkCore;

namespace FitMoldova.DataAccesLayer
{
     public class DbSession
     {
          public FitMoldovaContext FitMoldovaContext()
          {
               var options = new DbContextOptionsBuilder<FitMoldovaContext>()
                    .UseSqlServer(@"Server=localhost\SQLEXPRESS;Database=FitMoldovaDb;Trusted_Connection=True;TrustServerCertificate=True;")
                    .Options;
               return new FitMoldovaContext(options);
          }
     }
}