using FitMoldova.Domain.Models.Services;
using FitMoldova.Domain.Models.User;
using Microsoft.AspNetCore.Http;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IUserLogic
     {
          ServiceResponse Register(UserCreateDto dto);
          ServiceResponse Login(UserLoginDto dto);
          ServiceResponse CheckEmail(string email);
          ServiceResponse GetAll();
          ServiceResponse GetById(int id);
          ServiceResponse Update(int id, UserUpdateDto dto);
          ServiceResponse Delete(int id);
          ServiceResponse ChangeRole(int id, ChangeRoleDto dto);
          ServiceResponse ChangeStatus(int id, ChangeStatusDto dto);
          ServiceResponse GetProfile(int userId);
          ServiceResponse UpdateProfile(int userId, UserUpdateProfileDto dto);
          ServiceResponse GetCommunity();
          ServiceResponse Follow(int followerId, int followedId);
          ServiceResponse Unfollow(int followerId, int followedId);
          ServiceResponse GetFollowing(int userId);
          ServiceResponse UploadAvatar(int userId, IFormFile file, string webRootPath);
          ServiceResponse ChangePassword(int userId, ChangePasswordDto dto);
     }
}