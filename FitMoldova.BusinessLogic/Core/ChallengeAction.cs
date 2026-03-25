using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Challenge;
using FitMoldova.Domain.Models.Challenge;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
     public class ChallengeAction
     {
          private readonly DbSession _dbSession = new DbSession();

          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var list = ctx.Challenges.ToList();
               return new ServiceResponse { isSuccess = true, Data = list };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ch = ctx.Challenges.FirstOrDefault(c => c.Id == id);
               if (ch == null)
                    return new ServiceResponse { isSuccess = false, Message = "Provocarea nu a fost găsită." };
               return new ServiceResponse { isSuccess = true, Data = ch };
          }

          public ServiceResponse CreateChallengeExecution(ChallengeCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ch = new ChallengeEntity
               {
                    Name = dto.Name,
                    Description = dto.Description,
                    Duration = dto.Duration,
                    Difficulty = dto.Difficulty,
                    Participants = 0
               };
               ctx.Challenges.Add(ch);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Provocare creată.", Data = ch.Id };
          }

          public ServiceResponse JoinChallengeExecution(int challengeId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ch = ctx.Challenges.FirstOrDefault(c => c.Id == challengeId);
               if (ch == null)
                    return new ServiceResponse { isSuccess = false, Message = "Provocarea nu a fost găsită." };
               ch.Participants++;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Participi la provocare." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ch = ctx.Challenges.FirstOrDefault(c => c.Id == id);
               if (ch == null)
                    return new ServiceResponse { isSuccess = false, Message = "Provocarea nu a fost găsită." };
               ctx.Challenges.Remove(ch);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Provocare ștearsă." };
          }
     }
}