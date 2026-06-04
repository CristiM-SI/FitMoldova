using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;
using Microsoft.AspNetCore.Http;

namespace FitMoldova.BusinessLogic.Structure
{
     public class PostLogic : PostAction, IPostLogic
     {
          public ServiceResponse GetAll(int? currentUserId = null)                                      => GetAllExecution(currentUserId);
          public ServiceResponse GetAllPaged(int page, int pageSize, int? clubId, int? currentUserId = null) => GetAllPagedExecution(page, pageSize, clubId, currentUserId);
          public ServiceResponse GetById(int id, int? currentUserId = null)                              => GetByIdExecution(id, currentUserId);
          public ServiceResponse GetByUser(int userId, int? currentUserId = null)                        => GetByUserExecution(userId, currentUserId);
          public ServiceResponse CreatePost(PostCreateDto dto)                          => CreatePostExecution(dto);
          public ServiceResponse UploadImage(IFormFile file)                            => UploadImageExecution(file);
          public ServiceResponse UpdatePost(int postId, int userId, string role, PostUpdateDto dto) => UpdatePostExecution(postId, userId, role, dto);
          public ServiceResponse SoftDelete(int id, int userId, string role)            => SoftDeleteExecution(id, userId, role);
          public ServiceResponse Delete(int id)                                         => DeleteExecution(id);

          public ServiceResponse AddReply(PostReplyCreateDto dto)                       => AddReplyExecution(dto);
          public ServiceResponse AddComment(int postId, int userId, string content)     => AddCommentExecution(postId, userId, content);
          public ServiceResponse GetCommentsPaged(int postId, int page, int pageSize)   => GetCommentsPagedExecution(postId, page, pageSize);
          public ServiceResponse DeleteComment(int commentId, int userId, string role)  => DeleteCommentExecution(commentId, userId, role);

          public ServiceResponse LikePost(int postId, int userId)                      => LikePostExecution(postId, userId);
          public ServiceResponse LikeComment(int commentId, int userId)                => LikeCommentExecution(commentId, userId);

          public ServiceResponse GetBookmarkedPosts(int userId)                         => GetBookmarkedPostsExecution(userId);
          public ServiceResponse BookmarkPost(int postId, int userId)                   => BookmarkPostExecution(postId, userId);
          public ServiceResponse UnbookmarkPost(int postId, int userId)                 => UnbookmarkPostExecution(postId, userId);
          public ServiceResponse RepostPost(int postId, int userId)                     => RepostPostExecution(postId, userId);
          public ServiceResponse VotePoll(int postId, int userId, int optionIndex)      => VotePollExecution(postId, userId, optionIndex);
     }
}
