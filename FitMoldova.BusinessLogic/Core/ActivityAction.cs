using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Activity;
using FitMoldova.Domain.Enums;
using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Services;
using Microsoft.EntityFrameworkCore;

namespace FitMoldova.BusinessLogic.Core
{
    public class ActivityAction
    {
        private readonly DbSession _dbSession = new DbSession();

        public ServiceResponse GetAllExecution()
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var list = ctx.Activities
                .Include(a => a.User)
                .Include(a => a.Participants)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new ActivityInfoDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Type = a.Type,
                    Distance = a.Distance,
                    Duration = a.Duration,
                    Calories = a.Calories,
                    Date = a.Date,
                    Description = a.Description,
                    ImageUrl = a.ImageUrl,
                    CreatedBy = a.User.Username,
                    ParticipantsCount = a.Participants.Count
                })
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = list };
        }

        public ServiceResponse GetByIdExecution(int id)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var a = ctx.Activities
                .Include(a => a.User)
                .Include(a => a.Participants)
                .FirstOrDefault(a => a.Id == id);
            if (a == null)
                return new ServiceResponse { isSuccess = false, Message = "Activitatea nu a fost găsită." };

            return new ServiceResponse
            {
                isSuccess = true,
                Data = new ActivityInfoDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Type = a.Type,
                    Distance = a.Distance,
                    Duration = a.Duration,
                    Calories = a.Calories,
                    Date = a.Date,
                    Description = a.Description,
                    ImageUrl = a.ImageUrl,
                    CreatedBy = a.User.Username,
                    ParticipantsCount = a.Participants.Count
                }
            };
        }

        public ServiceResponse CreateActivityExecution(ActivityCreateDto dto)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var creator = ctx.Users.FirstOrDefault(u => u.Id == dto.UserId);
            if (creator == null)
            {
                creator = ctx.Users.FirstOrDefault(u => u.Role == UserRole.Admin);
                if (creator == null)
                    return new ServiceResponse { isSuccess = false, Message = "Nu există niciun admin în baza de date." };
            }

            var activity = new ActivityEntity
            {
                UserId = creator.Id,
                Name = dto.Name,
                Type = dto.Type,
                Distance = dto.Distance,
                Duration = dto.Duration,
                Calories = dto.Calories,
                Date = dto.Date,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };
            ctx.Activities.Add(activity);
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Activitate creată.", Data = activity.Id };
        }

        public ServiceResponse UpdateActivityExecution(int id, ActivityUpdateDto dto)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var activity = ctx.Activities.FirstOrDefault(a => a.Id == id);
            if (activity == null)
                return new ServiceResponse { isSuccess = false, Message = "Activitatea nu a fost găsită." };

            activity.Name      = dto.Name;
            activity.Type      = dto.Type;
            activity.Distance  = dto.Distance;
            activity.Duration  = dto.Duration;
            activity.Calories  = dto.Calories;
            activity.Date      = dto.Date;
            activity.Description = dto.Description;
            activity.ImageUrl  = dto.ImageUrl;

            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Activitate actualizată.", Data = activity.Id };
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

        public ServiceResponse JoinActivityExecution(int activityId, int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var activity = ctx.Activities.FirstOrDefault(a => a.Id == activityId);
            if (activity == null)
                return new ServiceResponse { isSuccess = false, Message = "Activitatea nu a fost găsită." };
            var userExists = ctx.Users.Any(u => u.Id == userId);
            if (!userExists)
                return new ServiceResponse { isSuccess = false, Message = "Userul nu există." };
            var alreadyJoined = ctx.ActivityParticipants.Any(ap => ap.ActivityId == activityId && ap.UserId == userId);
            if (alreadyJoined)
                return new ServiceResponse { isSuccess = false, Message = "Participi deja la această activitate." };
            ctx.ActivityParticipants.Add(new ActivityParticipantEntity
            {
                ActivityId = activityId,
                UserId     = userId,
                JoinedAt   = DateTime.UtcNow
            });
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Te-ai alăturat activității." };
        }

        public ServiceResponse GetParticipantsExecution(int activityId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var exists = ctx.Activities.Any(a => a.Id == activityId);
            if (!exists)
                return new ServiceResponse { isSuccess = false, Message = "Activitatea nu a fost găsită." };
            var participants = ctx.ActivityParticipants
                .Include(ap => ap.User)
                .Where(ap => ap.ActivityId == activityId)
                .Select(ap => new { ap.User.Id, ap.User.Username, ap.JoinedAt })
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = participants };
        }
    }
}