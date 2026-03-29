using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
     public class ActivityAction
     {
          private readonly DbSession _dbSession = new DbSession();

          public ServiceResponse CreateActivityExecution(ActivityCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var activity = new ActivityEntity
               {
                    UserId = dto.UserId,
                    Name = dto.Name,
                    Type = dto.Type,
                    Distance = dto.Distance,
                    Duration = dto.Duration,
                    Calories = dto.Calories,
                    Date = dto.Date
               };
               ctx.Activities.Add(activity);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Activitate adăugată.", Data = activity.Id };
          }

          public ServiceResponse GetByUserExecution(int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var list = ctx.Activities.Where(a => a.UserId == userId)
                             .OrderByDescending(a => a.Date).ToList();
               return new ServiceResponse { isSuccess = true, Data = list };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var activity = ctx.Activities.FirstOrDefault(a => a.Id == id);
               if (activity == null)
                    return new ServiceResponse { isSuccess = false, Message = "Activitatea nu a fost găsită." };
               return new ServiceResponse { isSuccess = true, Data = activity };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var activity = ctx.Activities.FirstOrDefault(a => a.Id == id);
               if (activity == null)
                    return new ServiceResponse { isSuccess = false, Message = "Activitatea nu a fost găsită." };
               ctx.Activities.Remove(activity);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Activitate ștearsă." };
          }
     }
}