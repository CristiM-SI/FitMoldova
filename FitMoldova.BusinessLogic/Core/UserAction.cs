using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Enums;
using FitMoldova.Domain.Models.Services;
using FitMoldova.Domain.Models.User;
using BC = BCrypt.Net.BCrypt;
using Microsoft.EntityFrameworkCore;

namespace FitMoldova.BusinessLogic.Core
{
     public class UserAction
     {
          private readonly FitMoldovaContext _ctx;
          public UserAction(FitMoldovaContext ctx)
          {
               _ctx = ctx;
          }

          public ServiceResponse RegisterExecution(UserCreateDto dto)
          {
               if (_ctx.Users.Any(u => u.Email == dto.Email))
                    return new ServiceResponse { isSuccess = false, Message = "Email deja folosit." };

               var baseUsername = $"{dto.FirstName.ToLower()}.{dto.LastName.ToLower()}";
               var username = baseUsername;
               var suffix = 1;
               while (_ctx.Users.Any(u => u.Username == username))
                    username = $"{baseUsername}{suffix++}";

               var user = new UDTable
               {
                    Username = username,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Password = BC.HashPassword(dto.Password),
                    CreatedAt = DateTime.UtcNow,
                    Role = UserRole.User,

                    // Câmpuri PII criptate la rest (AES-256-GCM via EF ValueConverter)
                    Phone = dto.Phone,
                    Location = dto.Location,
                    Bio = dto.Bio
               };
               _ctx.Users.Add(user);
               _ctx.SaveChanges();
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Cont creat.",
                    Data = new
                    {
                         user.Id,
                         user.Username,
                         user.FirstName,
                         user.LastName,
                         user.Email,
                         user.Role,
                         RegisteredAt = user.CreatedAt.ToString("o")
                    }
               };
          }

          public ServiceResponse LoginExecution(UserLoginDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u =>
                    u.Username == dto.Username || u.Email == dto.Username);
               if (user == null || !BC.Verify(dto.Password, user.Password))
                    return new ServiceResponse { isSuccess = false, Message = "Credențiale incorecte." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Login reușit.",
                    Data = new UserLoginResultDto
                    {
                         Id          = user.Id,
                         Username    = user.Username,
                         FirstName   = user.FirstName,
                         LastName    = user.LastName,
                         Email       = user.Email,
                         Role        = user.Role.ToString(),
                         RegisteredAt = user.CreatedAt.ToString("o")
                    }
               };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Userul cu ID {id} nu există." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Data = new { user.Id, user.Username, user.FirstName, user.LastName, user.Email, user.Role, user.CreatedAt }
               };
          }

          public ServiceResponse UpdateExecution(int id, UserUpdateDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               user.FirstName = dto.FirstName;
               user.LastName = dto.LastName;
               user.Email = dto.Email;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Profil actualizat." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               _ctx.Users.Remove(user);
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Cont șters." };
          }

          public ServiceResponse GetAllExecution()
          {
               var users = _ctx.Users.Select(u => new
               {
                    u.Id,
                    u.Username,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    Role = u.Role.ToString(),
                    u.IsActive,
                    u.CreatedAt
               }).ToList();
               return new ServiceResponse { isSuccess = true, Data = users };
          }

          public ServiceResponse ChangeRoleExecution(int id, ChangeRoleDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               if (!Enum.TryParse<UserRole>(dto.Role, ignoreCase: true, out var newRole))
                    return new ServiceResponse { isSuccess = false, Message = "Rol invalid." };
               user.Role = newRole;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Rol actualizat." };
          }

          public ServiceResponse ChangeStatusExecution(int id, ChangeStatusDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               user.IsActive = dto.IsActive;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = dto.IsActive ? "Utilizator reactivat." : "Utilizator blocat." };
          }

          public ServiceResponse GetProfileExecution(int userId)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Data = new
                    {
                         user.Id,
                         user.FirstName,
                         user.LastName,
                         user.Email,
                         user.Phone,
                         user.Location,
                         user.Bio,
                         user.ProfileImageUrl,
                         Role = user.Role.ToString(),
                         user.CreatedAt
                    }
               };
          }

          public ServiceResponse UpdateProfileExecution(int userId, UserUpdateProfileDto dto)
          {
               var user = _ctx.Users.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               if (dto.Phone != null) user.Phone = dto.Phone;
               if (dto.Location != null) user.Location = dto.Location;
               if (dto.Bio != null) user.Bio = dto.Bio;
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Profil actualizat." };
          }

          public ServiceResponse GetCommunityExecution()
          {
               var users = _ctx.Users
                   .Where(u => u.IsActive)
                   .Select(u => new
                   {
                        u.Id,
                        u.Username,
                        u.FirstName,
                        u.LastName,
                        u.ProfileImageUrl,
                        FollowersCount = _ctx.UserFollows.Count(f => f.FollowedId == u.Id)
                   }).ToList();
               return new ServiceResponse { isSuccess = true, Data = users };
          }

          public ServiceResponse FollowExecution(int followerId, int followedId)
          {
               if (followerId == followedId)
                    return new ServiceResponse { isSuccess = false, Message = "Nu te poți urmări pe tine însuți." };
               if (!_ctx.Users.Any(u => u.Id == followedId))
                    return new ServiceResponse { isSuccess = false, Message = "Utilizatorul nu există." };
               if (_ctx.UserFollows.Any(f => f.FollowerId == followerId && f.FollowedId == followedId))
                    return new ServiceResponse { isSuccess = false, Message = "Deja urmărești acest utilizator." };

               _ctx.UserFollows.Add(new UserFollowEntity { FollowerId = followerId, FollowedId = followedId });
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Urmărești acum acest utilizator." };
          }

          public ServiceResponse UnfollowExecution(int followerId, int followedId)
          {
               var follow = _ctx.UserFollows.FirstOrDefault(f => f.FollowerId == followerId && f.FollowedId == followedId);
               if (follow == null)
                    return new ServiceResponse { isSuccess = false, Message = "Nu urmărești acest utilizator." };
               _ctx.UserFollows.Remove(follow);
               _ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Nu mai urmărești acest utilizator." };
          }
     }
}