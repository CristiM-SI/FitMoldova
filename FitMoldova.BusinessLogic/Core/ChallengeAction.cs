using AutoMapper;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Challenge;
using FitMoldova.Domain.Models.Challenge;
using FitMoldova.Domain.Models.Services;
using Microsoft.EntityFrameworkCore;

namespace FitMoldova.BusinessLogic.Core
{
    public class ChallengeAction
    {
         private readonly DbSession _dbSession = new DbSession();

        public ServiceResponse GetAllExecution()
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var list = ctx.Challenges.Select(c => new ChallengeDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Duration = c.Duration,
                Difficulty = c.Difficulty,
                Participants = ctx.ChallengeParticipants.Count(cp => cp.ChallengeId == c.Id)
            }).ToList();
            return new ServiceResponse { isSuccess = true, Data = list };
        }

        public ServiceResponse GetByIdExecution(int id)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var ch = ctx.Challenges.Where(c => c.Id == id).Select(c => new ChallengeDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Duration = c.Duration,
                Difficulty = c.Difficulty,
                Participants = ctx.ChallengeParticipants.Count(cp => cp.ChallengeId == c.Id)
            }).FirstOrDefault();
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
            // Returnăm obiectul complet (ca la Club/Event) pentru a putea face optimistic update
            return new ServiceResponse { isSuccess = true, Message = "Provocare creată.", Data = ch };
        }

        public ServiceResponse UpdateChallengeExecution(int id, ChallengeUpdateDto dto)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var ch = ctx.Challenges.FirstOrDefault(c => c.Id == id);
            if (ch == null)
                return new ServiceResponse { isSuccess = false, Message = "Provocarea nu a fost găsită." };

            ch.Name = dto.Name;
            ch.Description = dto.Description;
            ch.Duration = dto.Duration;
            ch.Difficulty = dto.Difficulty;

            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Provocare actualizată.", Data = ch };
        }

        public ServiceResponse JoinChallengeExecution(int challengeId, int userId)
        {
             using var ctx = _dbSession.FitMoldovaContext();
             var ch = ctx.Challenges.FirstOrDefault(c => c.Id == challengeId);
             if (ch == null) return new ServiceResponse { isSuccess = false, Message = "Provocarea nu a fost găsită." };

             bool alreadyJoined = ctx.ChallengeParticipants.Any(cp => cp.ChallengeId == challengeId && cp.UserId == userId);
             if (alreadyJoined) return new ServiceResponse { isSuccess = false, Message = "Ești deja înscris." };

             ctx.ChallengeParticipants.Add(new ChallengeParticipantEntity { ChallengeId = challengeId, UserId = userId, JoinedAt = DateTime.UtcNow });
             ch.Participants++;
             ctx.SaveChanges();
             return new ServiceResponse { isSuccess = true, Message = "Participi la provocare." };
        }

        public ServiceResponse LeaveChallengeExecution(int challengeId, int userId)
        {
             using var ctx = _dbSession.FitMoldovaContext();
             var ch = ctx.Challenges.FirstOrDefault(c => c.Id == challengeId);
             if (ch == null) return new ServiceResponse { isSuccess = false, Message = "Provocarea nu a fost găsită." };

             var participant = ctx.ChallengeParticipants.FirstOrDefault(cp => cp.ChallengeId == challengeId && cp.UserId == userId);
             if (participant == null) return new ServiceResponse { isSuccess = false, Message = "Nu ești înscris." };

             ctx.ChallengeParticipants.Remove(participant);
             if (ch.Participants > 0) ch.Participants--;
             ctx.SaveChanges();
             return new ServiceResponse { isSuccess = true, Message = "Ai ieșit din provocare." };
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

        public ServiceResponse GetJoinedExecution(int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var joined = (from cp in ctx.ChallengeParticipants
                          join c in ctx.Challenges on cp.ChallengeId equals c.Id
                          where cp.UserId == userId
                          select new
                          {
                              c.Id,
                              c.Name,
                              c.Description,
                              c.Duration,
                              c.Difficulty,
                              Participants = ctx.ChallengeParticipants.Count(p => p.ChallengeId == c.Id),
                              cp.JoinedAt
                          }).ToList();

            var result = joined.Select(j =>
            {
                int progressPercent = 0;
                var parts = j.Duration.Split(' ');
                if (parts.Length > 0 && int.TryParse(parts[0], out int totalDays) && totalDays > 0)
                {
                    double daysPassed = (DateTime.UtcNow - j.JoinedAt).TotalDays;
                    progressPercent = Math.Min(100, (int)(daysPassed / totalDays * 100));
                }
                return new ChallengeJoinedDto
                {
                    Id = j.Id,
                    Name = j.Name,
                    Description = j.Description,
                    Duration = j.Duration,
                    Difficulty = j.Difficulty,
                    Participants = j.Participants,
                    JoinedAt = j.JoinedAt,
                    ProgressPercent = progressPercent
                };
            }).ToList();

            return new ServiceResponse { isSuccess = true, Data = result };
        }
    }
}