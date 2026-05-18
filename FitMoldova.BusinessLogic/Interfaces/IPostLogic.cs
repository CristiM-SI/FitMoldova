using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IPostLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetAllPaged(int page, int pageSize, int? clubId);
          ServiceResponse GetById(int id);
          ServiceResponse GetByUser(int userId);
          ServiceResponse CreatePost(PostCreateDto dto);
          ServiceResponse UpdatePost(int postId, int userId, string role, PostUpdateDto dto);
          ServiceResponse SoftDelete(int id, int userId, string role);
          ServiceResponse Delete(int id);

          ServiceResponse AddReply(PostReplyCreateDto dto);
          ServiceResponse AddComment(int postId, int userId, string content);
          ServiceResponse GetCommentsPaged(int postId, int page, int pageSize);
          ServiceResponse DeleteComment(int commentId, int userId, string role);

          ServiceResponse LikePost(int postId, int userId);
          ServiceResponse LikeComment(int commentId, int userId);

          ServiceResponse GetBookmarkedPosts(int userId);
          ServiceResponse BookmarkPost(int postId, int userId);
          ServiceResponse UnbookmarkPost(int postId, int userId);
          ServiceResponse RepostPost(int postId, int userId);
          ServiceResponse VotePoll(int postId, int userId, int optionIndex);
     }
}