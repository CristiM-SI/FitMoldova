using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class PostLogic : PostAction, IPostLogic
     {
          public ServiceResponse GetAll() => GetAllExecution();
          public ServiceResponse GetByUser(int userId) => GetByUserExecution(userId);
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse CreatePost(PostCreateDto dto) => CreatePostExecution(dto);
          public ServiceResponse LikePost(int pId, int uId) => LikePostExecution(pId, uId);
          public ServiceResponse AddReply(PostReplyCreateDto dto) => AddReplyExecution(dto);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
     }
}