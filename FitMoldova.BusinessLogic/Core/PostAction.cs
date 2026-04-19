using AutoMapper;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Post;
using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FitMoldova.BusinessLogic.Core
{
     public class PostAction
     {
          private readonly DbSession _dbSession = new DbSession();

          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = ctx.Posts.OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto
                   {
                        Id = p.Id,
                        UserId = p.UserId,
                        Content = p.Content,
                        Sport = p.Sport,
                        Likes = p.Likes,
                        CommentsCount = p.CommentsCount,
                        CreatedAt = p.CreatedAt
                   }).ToList();
               return new ServiceResponse { isSuccess = true, Data = posts };
          }

          public ServiceResponse GetByUserExecution(int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = ctx.Posts.Where(p => p.UserId == userId)
                   .OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto
                   {
                        Id = p.Id,
                        UserId = p.UserId,
                        Content = p.Content,
                        Sport = p.Sport,
                        Likes = p.Likes,
                        CommentsCount = p.CommentsCount,
                        CreatedAt = p.CreatedAt
                   }).ToList();
               return new ServiceResponse { isSuccess = true, Data = posts };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == id);
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Postarea cu ID {id} nu există." };
               var replies = ctx.PostReplies.Where(r => r.PostId == id)
                                .OrderBy(r => r.CreatedAt).ToList();
               return new ServiceResponse { isSuccess = true, Data = new { Post = post, Replies = replies } };
          }

          public ServiceResponse CreatePostExecution(PostCreateDto dto)
          {
               if (string.IsNullOrWhiteSpace(dto.Content))
                    return new ServiceResponse { isSuccess = false, Message = "Conținutul nu poate fi gol." };
               using var ctx = _dbSession.FitMoldovaContext();
               var post = new PostEntity
               {
                    UserId = dto.UserId,
                    Content = dto.Content,
                    Sport = dto.Sport,
                    CreatedAt = DateTime.UtcNow
               };
               ctx.Posts.Add(post);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Postare creată.", Data = post.Id };
          }

          public ServiceResponse LikePostExecution(int postId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == postId);
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = "Postarea nu a fost găsită.." };
               post.Likes++;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Like adăugat.", Data = post.Likes };
          }

          public ServiceResponse AddReplyExecution(PostReplyCreateDto dto)
          {
               if (string.IsNullOrWhiteSpace(dto.Content))
                    return new ServiceResponse { isSuccess = false, Message = "Conținutul nu poate fi gol." };
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == dto.PostId);
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = "Postarea nu a fost găsită." };
               var reply = new PostReplyEntity
               {
                    PostId = dto.PostId,
                    UserId = dto.UserId,
                    Content = dto.Content,
                    CreatedAt = DateTime.UtcNow
               };
               ctx.PostReplies.Add(reply);
               post.CommentsCount++;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Reply adăugat.", Data = reply.Id };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == id);
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = "Postarea nu a fost găsită." };
               var replies = ctx.PostReplies.Where(r => r.PostId == id).ToList();
               ctx.PostReplies.RemoveRange(replies);
               ctx.Posts.Remove(post);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Postare ștearsă." };
          }
     }
}
