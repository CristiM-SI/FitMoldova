using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.User;
using FitMoldova.Domain.Enums;
using FitMoldova.Domain.Models.Services;
using FitMoldova.Domain.Models.User;

namespace FitMoldova.BusinessLogic.Core
{
     public class UserAction
     {
          private readonly DbSession _dbSession = new DbSession();

          public ServiceResponse RegisterExecution(UserCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();

               if (ctx.Users.Any(u => u.Email == dto.Email))
                    return new ServiceResponse { isSuccess = false, Message = "Email deja folosit." };

               // Generate unique username from firstName.lastName
               var baseUsername = $"{dto.FirstName.ToLower()}.{dto.LastName.ToLower()}";
               var username = baseUsername;
               var suffix = 1;
               while (ctx.Users.Any(u => u.Username == username))
                    username = $"{baseUsername}{suffix++}";

               var user = new UDTable
               {
                    Username = username,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Password = dto.Password,
                    CreatedAt = DateTime.UtcNow,
                    Role = UserRole.User
               };
               ctx.Users.Add(user);
               ctx.SaveChanges();
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
               using var ctx = _dbSession.FitMoldovaContext();
               var user = ctx.Users.FirstOrDefault(u =>
                   (u.Username == dto.Username || u.Email == dto.Username)
                   && u.Password == dto.Password);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Credențiale incorecte." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Login reușit.",
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

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var user = ctx.Users.FirstOrDefault(u => u.Id == id);
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
               using var ctx = _dbSession.FitMoldovaContext();
               var user = ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               user.FirstName = dto.FirstName;
               user.LastName = dto.LastName;
               user.Email = dto.Email;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Profil actualizat." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var user = ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               ctx.Users.Remove(user);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Cont șters." };
          }
     }
}