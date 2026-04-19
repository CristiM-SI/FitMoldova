using FitMoldova.Domain.Models.Services;
using FitMoldova.Domain.Models.User;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IUserLogic
     {
          ServiceResponse Register(UserCreateDto dto);
          ServiceResponse Login(UserLoginDto dto);
          ServiceResponse GetById(int id);
          ServiceResponse Update(int id, UserUpdateDto dto);
          ServiceResponse Delete(int id);
          ServiceResponse GetProfile(int userId);
          ServiceResponse UpdateProfile(int userId, UserUpdateProfileDto dto);
     }
}