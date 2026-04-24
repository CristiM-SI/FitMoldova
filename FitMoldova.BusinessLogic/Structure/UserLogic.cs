using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Models.Services;
using FitMoldova.Domain.Models.User;

namespace FitMoldova.BusinessLogic.Structure
{
     public class UserLogic : UserAction, IUserLogic
     {
         
          public UserLogic(FitMoldovaContext ctx) : base(ctx)
          {
          }

          public ServiceResponse Register(UserCreateDto dto) => RegisterExecution(dto);
          public ServiceResponse Login(UserLoginDto dto) => LoginExecution(dto);
          public ServiceResponse GetAll() => GetAllExecution();
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse Update(int id, UserUpdateDto dto) => UpdateExecution(id, dto);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
          public ServiceResponse ChangeRole(int id, ChangeRoleDto dto) => ChangeRoleExecution(id, dto);
          public ServiceResponse ChangeStatus(int id, ChangeStatusDto dto) => ChangeStatusExecution(id, dto);
          public ServiceResponse GetProfile(int userId) => GetProfileExecution(userId);
          public ServiceResponse UpdateProfile(int userId, UserUpdateProfileDto dto) => UpdateProfileExecution(userId, dto);
          public ServiceResponse GetCommunity() => GetCommunityExecution();
          public ServiceResponse Follow(int followerId, int followedId) => FollowExecution(followerId, followedId);
          public ServiceResponse Unfollow(int followerId, int followedId) => UnfollowExecution(followerId, followedId);
     }
}