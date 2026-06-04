using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;
using Microsoft.AspNetCore.Http;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IPostLogic
     {
          ServiceResponse GetAll(int? currentUserId = null);
          ServiceResponse GetAllPaged(int page, int pageSize, int? clubId, int? currentUserId = null);
          ServiceResponse GetById(int id, int? currentUserId = null);
          ServiceResponse GetByUser(int userId, int? currentUserId = null);
          ServiceResponse CreatePost(PostCreateDto dto);
          ServiceResponse UploadImage(IFormFile file);
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