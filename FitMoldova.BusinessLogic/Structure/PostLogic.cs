using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class PostLogic : PostAction, IPostLogic
     {
          public ServiceResponse GetAll() => GetAllExecution();
          public ServiceResponse GetAllPaged(int page, int pageSize, int? clubId) => GetAllPagedExecution(page, pageSize, clubId);
          public ServiceResponse GetByUser(int userId) => GetByUserExecution(userId);
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse CreatePost(PostCreateDto dto) => CreatePostExecution(dto);
          public ServiceResponse UpdatePost(int postId, int userId, string role, PostUpdateDto dto) => UpdatePostExecution(postId, userId, role, dto);
          public ServiceResponse LikePost(int pId, int uId) => LikePostExecution(pId, uId);
          public ServiceResponse AddReply(PostReplyCreateDto dto) => AddReplyExecution(dto);
          public ServiceResponse AddComment(int postId, int userId, string content) => AddCommentExecution(postId, userId, content);
          public ServiceResponse GetCommentsPaged(int postId, int page, int pageSize) => GetCommentsPagedExecution(postId, page, pageSize);
          public ServiceResponse SoftDelete(int id, int userId, string role) => SoftDeleteExecution(id, userId, role);
          public ServiceResponse DeleteComment(int commentId, int userId, string role) => DeleteCommentExecution(commentId, userId, role);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
     }
}
