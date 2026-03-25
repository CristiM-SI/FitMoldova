using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Route;
using FitMoldova.Domain.Models.Route;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
     public class RouteAction
     {
          private readonly DbSession _dbSession = new DbSession();

          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var list = ctx.Routes.OrderBy(r => r.Name).ToList();
               return new ServiceResponse { isSuccess = true, Data = list };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var route = ctx.Routes.FirstOrDefault(r => r.Id == id);
               if (route == null)
                    return new ServiceResponse { isSuccess = false, Message = "Traseul nu a fost găsit." };
               return new ServiceResponse { isSuccess = true, Data = route };
          }

          public ServiceResponse CreateRouteExecution(RouteCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var route = new RouteEntity
               {
                    Name = dto.Name,
                    Type = dto.Type,
                    Difficulty = dto.Difficulty,
                    Distance = dto.Distance,
                    EstimatedDuration = dto.EstimatedDuration,
                    ElevationGain = dto.ElevationGain,
                    Description = dto.Description,
                    Region = dto.Region,
                    Surface = dto.Surface,
                    IsLoop = dto.IsLoop
               };
               ctx.Routes.Add(route);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Traseu adăugat.", Data = route.Id };
          }

          public ServiceResponse UpdateExecution(int id, RouteCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var route = ctx.Routes.FirstOrDefault(r => r.Id == id);
               if (route == null)
                    return new ServiceResponse { isSuccess = false, Message = "Traseul nu a fost găsit." };
               route.Name = dto.Name; route.Type = dto.Type; route.Difficulty = dto.Difficulty;
               route.Distance = dto.Distance; route.EstimatedDuration = dto.EstimatedDuration;
               route.ElevationGain = dto.ElevationGain; route.Description = dto.Description;
               route.Region = dto.Region; route.Surface = dto.Surface; route.IsLoop = dto.IsLoop;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Traseu actualizat." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var route = ctx.Routes.FirstOrDefault(r => r.Id == id);
               if (route == null)
                    return new ServiceResponse { isSuccess = false, Message = "Traseul nu a fost găsit." };
               ctx.Routes.Remove(route);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Traseu șters." };
          }
     }
}