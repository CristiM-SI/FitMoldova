using AutoMapper;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Club;
using FitMoldova.Domain.Models.Club;
using FitMoldova.Domain.Models.Services;
using Microsoft.EntityFrameworkCore;

namespace FitMoldova.BusinessLogic.Core
{
    public class ClubAction
    { 
         private readonly DbSession _dbSession = new DbSession();
         private readonly IMapper _mapper;

         public ClubAction(IMapper mapper)
         {
              _mapper = mapper;
         }

        public ServiceResponse GetAllExecution()
        {
            using var ctx = _dbSession.FitMoldovaContext();
            // Proiecție LINQ — EF Core traduce în SQL cu COUNT(*) pe ClubMembers.
            var list = ctx.Clubs
                .OrderByDescending(c => c.Rating)
                .Select(c => new ClubInfoDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Category = c.Category,
                    Location = c.Location,
                    Description = c.Description,
                    Schedule = c.Schedule,
                    Level = c.Level,
                    Rating = c.Rating,
                    ImageUrl = c.ImageUrl,
                    MembersCount = c.Members.Count
                })
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = list };
        }

        public ServiceResponse GetByIdExecution(int id)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var c = ctx.Clubs
                .Where(x => x.Id == id)
                .Select(c => new ClubInfoDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Category = c.Category,
                    Location = c.Location,
                    Description = c.Description,
                    Schedule = c.Schedule,
                    Level = c.Level,
                    Rating = c.Rating,
                    ImageUrl = c.ImageUrl,
                    MembersCount = c.Members.Count
                })
                .FirstOrDefault();
            if (c == null)
                return new ServiceResponse { isSuccess = false, Message = "Clubul nu a fost găsit." };
            return new ServiceResponse { isSuccess = true, Data = c };
        }

        public ServiceResponse CreateClubExecution(ClubCreateDto dto)
        {
            using var ctx = _dbSession.FitMoldovaContext();

            // AutoMapper convertește toate câmpurile DTO → Entity. Rating-ul
            // e setat la 0 prin configurația din MappingProfile.
            var club = _mapper.Map<ClubEntity>(dto);

            ctx.Clubs.Add(club);
            ctx.SaveChanges();

            // Răspuns: întoarcem DTO-ul cu id-ul generat și MembersCount = 0.
            var result = new ClubInfoDto
            {
                Id = club.Id,
                Name = club.Name,
                Category = club.Category,
                Location = club.Location,
                Description = club.Description,
                Schedule = club.Schedule,
                Level = club.Level,
                Rating = club.Rating,
                ImageUrl = club.ImageUrl,
                MembersCount = 0
            };
            return new ServiceResponse { isSuccess = true, Message = "Club creat.", Data = result };
        }

        public ServiceResponse UpdateClubExecution(int id, ClubUpdateDto dto)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var club = ctx.Clubs.FirstOrDefault(c => c.Id == id);
            if (club == null)
                return new ServiceResponse { isSuccess = false, Message = "Clubul nu a fost găsit." };

            // Map peste entitatea existentă, păstrând Id-ul și relațiile.
            _mapper.Map(dto, club);

            ctx.SaveChanges();

            var membersCount = ctx.ClubMembers.Count(cm => cm.ClubId == id);
            var result = new ClubInfoDto
            {
                Id = club.Id,
                Name = club.Name,
                Category = club.Category,
                Location = club.Location,
                Description = club.Description,
                Schedule = club.Schedule,
                Level = club.Level,
                Rating = club.Rating,
                ImageUrl = club.ImageUrl,
                MembersCount = membersCount
            };
            return new ServiceResponse { isSuccess = true, Message = "Club actualizat.", Data = result };
        }

        public ServiceResponse JoinClubExecution(int clubId, int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();

            var clubExists = ctx.Clubs.Any(c => c.Id == clubId);
            if (!clubExists)
                return new ServiceResponse { isSuccess = false, Message = "Clubul nu a fost găsit." };

            var userExists = ctx.Users.Any(u => u.Id == userId);
            if (!userExists)
                return new ServiceResponse { isSuccess = false, Message = "Userul nu există." };

            var alreadyMember = ctx.ClubMembers.Any(cm => cm.ClubId == clubId && cm.UserId == userId);
            if (alreadyMember)
                return new ServiceResponse { isSuccess = false, Message = "Ești deja membru al acestui club." };

            ctx.ClubMembers.Add(new ClubMemberEntity
            {
                ClubId = clubId,
                UserId = userId,
                JoinedAt = DateTime.UtcNow
            });
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Te-ai alăturat clubului." };
        }

        public ServiceResponse LeaveClubExecution(int clubId, int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var membership = ctx.ClubMembers
                .FirstOrDefault(cm => cm.ClubId == clubId && cm.UserId == userId);
            if (membership == null)
                return new ServiceResponse { isSuccess = false, Message = "Nu ești membru al acestui club." };

            ctx.ClubMembers.Remove(membership);
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Ai părăsit clubul." };
        }

        public ServiceResponse GetMembersExecution(int clubId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var exists = ctx.Clubs.Any(c => c.Id == clubId);
            if (!exists)
                return new ServiceResponse { isSuccess = false, Message = "Clubul nu a fost găsit." };

            var members = ctx.ClubMembers
                .Include(cm => cm.User)
                .Where(cm => cm.ClubId == clubId)
                .OrderBy(cm => cm.JoinedAt)
                .Select(cm => new { cm.User.Id, cm.User.Username, cm.JoinedAt })
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = members };
        }

        public ServiceResponse GetUserClubsExecution(int userId)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var userExists = ctx.Users.Any(u => u.Id == userId);
            if (!userExists)
                return new ServiceResponse { isSuccess = false, Message = "Userul nu există." };

            var clubs = ctx.ClubMembers
                .Where(cm => cm.UserId == userId)
                .Select(cm => new ClubInfoDto
                {
                    Id = cm.Club.Id,
                    Name = cm.Club.Name,
                    Category = cm.Club.Category,
                    Location = cm.Club.Location,
                    Description = cm.Club.Description,
                    Schedule = cm.Club.Schedule,
                    Level = cm.Club.Level,
                    Rating = cm.Club.Rating,
                    ImageUrl = cm.Club.ImageUrl,
                    MembersCount = cm.Club.Members.Count
                })
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = clubs };
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
