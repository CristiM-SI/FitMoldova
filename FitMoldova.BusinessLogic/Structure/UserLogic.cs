using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Services;
using FitMoldova.Domain.Models.User;

namespace FitMoldova.BusinessLogic.Structure
{
     public class UserLogic : UserAction, IUserLogic
     {
          public ServiceResponse Register(UserCreateDto dto) => RegisterExecution(dto);
          public ServiceResponse Login(UserLoginDto dto) => LoginExecution(dto);
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse Update(int id, UserUpdateDto dto) => UpdateExecution(id, dto);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
     }
}