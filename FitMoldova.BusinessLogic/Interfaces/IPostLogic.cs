using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IPostLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetAllPaged(int page, int pageSize, int? clubId);
          ServiceResponse GetByUser(int userId);
          ServiceResponse GetById(int id);
          ServiceResponse CreatePost(PostCreateDto dto);
          ServiceResponse UpdatePost(int postId, int userId, string role, PostUpdateDto dto);
          ServiceResponse LikePost(int postId, int userId);
          ServiceResponse AddReply(PostReplyCreateDto dto);
          ServiceResponse AddComment(int postId, int userId, string content);
          ServiceResponse GetCommentsPaged(int postId, int page, int pageSize);
          ServiceResponse SoftDelete(int id, int userId, string role);
          ServiceResponse DeleteComment(int commentId, int userId, string role);
          ServiceResponse Delete(int id);
     }
}
