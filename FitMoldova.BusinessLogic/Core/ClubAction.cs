using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Club;
using FitMoldova.Domain.Models.Club;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
     public class ClubAction
     {
          private readonly DbSession _dbSession = new DbSession();

          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var list = ctx.Clubs.OrderByDescending(c => c.Rating).ToList();
               return new ServiceResponse { isSuccess = true, Data = list };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var club = ctx.Clubs.FirstOrDefault(c => c.Id == id);
               if (club == null)
                    return new ServiceResponse { isSuccess = false, Message = "Clubul nu a fost găsit." };
               return new ServiceResponse { isSuccess = true, Data = club };
          }

          public ServiceResponse CreateClubExecution(ClubCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var club = new ClubEntity
               {
                    Name = dto.Name,
                    Category = dto.Category,
                    Location = dto.Location,
                    Description = dto.Description,
                    Schedule = dto.Schedule,
                    Level = dto.Level,
                    Rating = 0,
                    Members = 0
               };
               ctx.Clubs.Add(club);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Club creat.", Data = club.Id };
          }

          public ServiceResponse JoinClubExecution(int clubId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var club = ctx.Clubs.FirstOrDefault(c => c.Id == clubId);
               if (club == null)
                    return new ServiceResponse { isSuccess = false, Message = "Clubul nu a fost găsit." };
               club.Members++;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Te-ai alăturat clubului." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var club = ctx.Clubs.FirstOrDefault(c => c.Id == id);
               if (club == null)
                    return new ServiceResponse { isSuccess = false, Message = "Clubul nu a fost găsit." };
               ctx.Clubs.Remove(club);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Club șters." };
          }
     }
}