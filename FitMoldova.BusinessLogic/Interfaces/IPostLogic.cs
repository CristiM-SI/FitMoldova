using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IPostLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetByUser(int userId);
          ServiceResponse GetById(int id);
          ServiceResponse CreatePost(PostCreateDto dto);
          ServiceResponse LikePost(int postId, int userId);
          ServiceResponse AddReply(PostReplyCreateDto dto);
          ServiceResponse Delete(int id);
     }
}