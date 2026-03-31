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
               var exists = ctx.Users.Any(u => u.Username == dto.Username || u.Email == dto.Email);
               if (exists)
                    return new ServiceResponse { isSuccess = false, Message = "Username sau email deja folosit." };

               var user = new UDTable
               {
                    Username = dto.Username,
                    Email = dto.Email,
                    Password = dto.Password,
                    CreatedAt = DateTime.UtcNow,
                    Role = UserRole.User
               };
               ctx.Users.Add(user);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Cont creat.", Data = user.Id };
          }

          public ServiceResponse LoginExecution(UserLoginDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var user = ctx.Users.FirstOrDefault(u =>
                   (u.Username == dto.Credential || u.Email == dto.Credential)
                   && u.Password == dto.Password);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Credențiale incorecte." };
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Login reușit.",
                    Data = new { user.Id, user.Username, user.Email, Role = user.Role.ToString() }
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
                    Data = new { user.Id, user.Username, user.Email, Role = user.Role.ToString(), user.CreatedAt }
               };
          }

          public ServiceResponse UpdateExecution(int id, UserUpdateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var user = ctx.Users.FirstOrDefault(u => u.Id == id);
               if (user == null)
                    return new ServiceResponse { isSuccess = false, Message = "Userul nu a fost găsit." };
               user.Username = dto.Username;
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