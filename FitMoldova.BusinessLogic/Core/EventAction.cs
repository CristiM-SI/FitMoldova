using AutoMapper;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Event;
using FitMoldova.Domain.Models.Event;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
     public class EventAction
     {
          private readonly DbSession _dbSession = new DbSession();

          /// <summary>
          /// Forțează DateTime.Kind = Utc pentru PostgreSQL (coloană timestamptz).
          /// Evită eroarea "Cannot write DateTime with Kind=Unspecified".
          /// </summary>
          private static DateTime EnsureUtc(DateTime dt) => dt.Kind switch
          {
               DateTimeKind.Utc         => dt,
               DateTimeKind.Local       => dt.ToUniversalTime(),
               DateTimeKind.Unspecified => DateTime.SpecifyKind(dt, DateTimeKind.Utc),
               _                        => DateTime.SpecifyKind(dt, DateTimeKind.Utc),
          };

          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var list = ctx.Events.OrderBy(e => e.Date).ToList();
               return new ServiceResponse { isSuccess = true, Data = list };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ev = ctx.Events.FirstOrDefault(e => e.Id == id);
               if (ev == null)
                    return new ServiceResponse { isSuccess = false, Message = "Evenimentul nu a fost găsit." };
               return new ServiceResponse { isSuccess = true, Data = ev };
          }

          public ServiceResponse CreateEventExecution(EventCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ev = new EventEntity
               {
                    Name = dto.Name,
                    Description = dto.Description,
                    Date = EnsureUtc(dto.Date),
                    Location = dto.Location,
                    City = dto.City,
                    Category = dto.Category,
                    MaxParticipants = dto.MaxParticipants,
                    Price = dto.Price,
                    Organizer = dto.Organizer,
                    Difficulty = dto.Difficulty,
                    Participants = 0,
                    ImageUrl = dto.ImageUrl
               };
               ctx.Events.Add(ev);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Eveniment creat.", Data = ev };
          }


          public ServiceResponse UpdateEventExecution(int id, EventCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ev = ctx.Events.FirstOrDefault(e => e.Id == id);
               if (ev == null)
                    return new ServiceResponse { isSuccess = false, Message = "Evenimentul nu a fost găsit." };
               ev.Name = dto.Name;
               ev.Description = dto.Description;
               ev.Date = EnsureUtc(dto.Date);
               ev.Location = dto.Location;
               ev.City = dto.City;
               ev.Category = dto.Category;
               ev.MaxParticipants = dto.MaxParticipants;
               ev.Price = dto.Price;
               ev.Organizer = dto.Organizer;
               ev.Difficulty = dto.Difficulty;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Eveniment actualizat.", Data = ev };
          }

          public ServiceResponse JoinEventExecution(int eventId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ev = ctx.Events.FirstOrDefault(e => e.Id == eventId);
               if (ev == null)
                    return new ServiceResponse { isSuccess = false, Message = "Evenimentul nu a fost găsit." };
               if (ev.Participants >= ev.MaxParticipants)
                    return new ServiceResponse { isSuccess = false, Message = "Evenimentul este complet." };
               ev.Participants++;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Înscris la eveniment." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var ev = ctx.Events.FirstOrDefault(e => e.Id == id);
               if (ev == null)
                    return new ServiceResponse { isSuccess = false, Message = "Evenimentul nu a fost găsit." };
               ctx.Events.Remove(ev);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Eveniment șters." };
          }
     }
}
