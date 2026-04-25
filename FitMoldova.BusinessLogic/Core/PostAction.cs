using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Post;
using FitMoldova.Domain.Models.Common;
using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
     public class PostAction
     {
          private readonly DbSession _dbSession = new DbSession();

          private const int MaxPageSize = 100;

          private static (int page, int pageSize) NormalizePaging(int page, int pageSize)
          {
               if (page < 1) page = 1;
               if (pageSize < 1) pageSize = 20;
               if (pageSize > MaxPageSize) pageSize = MaxPageSize;
               return (page, pageSize);
          }

          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = ctx.Posts
                   .Where(p => !p.IsDeleted)
                   .OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto
                   {
                        Id = p.Id,
                        UserId = p.UserId,
                        AuthorName = p.User.FirstName + " " + p.User.LastName,
                        AuthorUsername = p.User.Username,
                        Content = p.Content,
                        Sport = p.Sport,
                        Likes = p.Likes,
                        CommentsCount = p.CommentsCount,
                        CreatedAt = p.CreatedAt
                   }).ToList();
               return new ServiceResponse { isSuccess = true, Data = posts };
          }

          public ServiceResponse GetAllPagedExecution(int page, int pageSize, int? clubId)
          {
               (page, pageSize) = NormalizePaging(page, pageSize);
               using var ctx = _dbSession.FitMoldovaContext();

               var query = ctx.Posts.Where(p => !p.IsDeleted);
               if (clubId.HasValue)
                    query = query.Where(p => p.ClubId == clubId.Value);

               var totalCount = query.Count();

               var items = query
                   .OrderByDescending(p => p.CreatedAt)
                   .Skip((page - 1) * pageSize)
                   .Take(pageSize)
                   .Select(p => new PostInfoDto
                   {
                        Id = p.Id,
                        UserId = p.UserId,
                        AuthorName = p.User.FirstName + " " + p.User.LastName,
                        AuthorUsername = p.User.Username,
                        Content = p.Content,
                        Sport = p.Sport,
                        Likes = p.Likes,
                        CommentsCount = p.CommentsCount,
                        CreatedAt = p.CreatedAt
                   }).ToList();

               var result = new PagedResultDto<PostInfoDto>
               {
                    Items = items,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalCount
               };
               return new ServiceResponse { isSuccess = true, Data = result };
          }

          public ServiceResponse GetByUserExecution(int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = ctx.Posts
                   .Where(p => p.UserId == userId && !p.IsDeleted)
                   .OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto
                   {
                        Id = p.Id,
                        UserId = p.UserId,
                        AuthorName = p.User.FirstName + " " + p.User.LastName,
                        AuthorUsername = p.User.Username,
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
               var post = ctx.Posts
                   .Where(p => p.Id == id && !p.IsDeleted)
                   .Select(p => new PostInfoDto
                   {
                        Id = p.Id,
                        UserId = p.UserId,
                        AuthorName = p.User.FirstName + " " + p.User.LastName,
                        AuthorUsername = p.User.Username,
                        Content = p.Content,
                        Sport = p.Sport,
                        Likes = p.Likes,
                        CommentsCount = p.CommentsCount,
                        CreatedAt = p.CreatedAt
                   }).FirstOrDefault();
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Postarea cu ID {id} nu există." };

               var replies = (from r in ctx.PostReplies
                              join u in ctx.Users on r.UserId equals u.Id
                              where r.PostId == id && !r.IsDeleted
                              orderby r.CreatedAt
                              select new ReplyDto
                              {
                                   Id = r.Id,
                                   PostId = r.PostId,
                                   UserId = r.UserId,
                                   AuthorName = u.FirstName + " " + u.LastName,
                                   AuthorUsername = u.Username,
                                   Content = r.Content,
                                   Likes = r.Likes,
                                   CreatedAt = r.CreatedAt
                              }).ToList();

               return new ServiceResponse { isSuccess = true, Data = new PostWithRepliesDto { Post = post, Replies = replies } };
          }

          public ServiceResponse CreatePostExecution(PostCreateDto dto)
          {
               if (string.IsNullOrWhiteSpace(dto.Content))
                    return new ServiceResponse { isSuccess = false, Message = "Conținutul nu poate fi gol." };
               using var ctx = _dbSession.FitMoldovaContext();

               if (dto.ClubId.HasValue && !ctx.Clubs.Any(c => c.Id == dto.ClubId.Value))
                    return new ServiceResponse { isSuccess = false, Message = "Clubul specificat nu există." };

               var post = new PostEntity
               {
                    UserId = dto.UserId,
                    Content = dto.Content,
                    Sport = dto.Sport,
                    ClubId = dto.ClubId,
                    CreatedAt = DateTime.UtcNow
               };
               ctx.Posts.Add(post);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Postare creată.", Data = post.Id };
          }

          public ServiceResponse UpdatePostExecution(int postId, int userId, string role, PostUpdateDto dto)
          {
               if (string.IsNullOrWhiteSpace(dto.Content))
                    return new ServiceResponse { isSuccess = false, Message = "Conținutul nu poate fi gol." };

               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == postId && !p.IsDeleted);
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = "Postarea nu a fost găsită." };

               if (post.UserId != userId && !string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
                    return new ServiceResponse { isSuccess = false, Message = "Nu ai dreptul să editezi această postare." };

               post.Content = dto.Content;
               post.Sport = dto.Sport;
               post.UpdatedAt = DateTime.UtcNow;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Postare actualizată." };
          }

          public ServiceResponse LikePostExecution(int postId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == postId && !p.IsDeleted);
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
               var post = ctx.Posts.FirstOrDefault(p => p.Id == dto.PostId && !p.IsDeleted);
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

          public ServiceResponse AddCommentExecution(int postId, int userId, string content)
          {
               return AddReplyExecution(new PostReplyCreateDto
               {
                    PostId = postId,
                    UserId = userId,
                    Content = content
               });
          }

          public ServiceResponse GetCommentsPagedExecution(int postId, int page, int pageSize)
          {
               (page, pageSize) = NormalizePaging(page, pageSize);
               using var ctx = _dbSession.FitMoldovaContext();

               if (!ctx.Posts.Any(p => p.Id == postId && !p.IsDeleted))
                    return new ServiceResponse { isSuccess = false, Message = "Postarea nu a fost găsită." };

               var query = from r in ctx.PostReplies
                           where r.PostId == postId && !r.IsDeleted
                           select r;

               var totalCount = query.Count();

               var items = (from r in query
                            join u in ctx.Users on r.UserId equals u.Id
                            orderby r.CreatedAt
                            select new ReplyDto
                            {
                                 Id = r.Id,
                                 PostId = r.PostId,
                                 UserId = r.UserId,
                                 AuthorName = u.FirstName + " " + u.LastName,
                                 AuthorUsername = u.Username,
                                 Content = r.Content,
                                 Likes = r.Likes,
                                 CreatedAt = r.CreatedAt
                            })
                            .Skip((page - 1) * pageSize)
                            .Take(pageSize)
                            .ToList();

               var result = new PagedResultDto<ReplyDto>
               {
                    Items = items,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalCount
               };
               return new ServiceResponse { isSuccess = true, Data = result };
          }

          public ServiceResponse SoftDeleteExecution(int id, int userId, string role)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == id && !p.IsDeleted);
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = "Postarea nu a fost găsită." };

               if (post.UserId != userId && !string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
                    return new ServiceResponse { isSuccess = false, Message = "Nu ai dreptul să ștergi această postare." };

               post.IsDeleted = true;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Postare ștearsă." };
          }

          public ServiceResponse DeleteCommentExecution(int commentId, int userId, string role)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var reply = ctx.PostReplies.FirstOrDefault(r => r.Id == commentId && !r.IsDeleted);
               if (reply == null)
                    return new ServiceResponse { isSuccess = false, Message = "Comentariul nu a fost găsit." };

               if (reply.UserId != userId && !string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
                    return new ServiceResponse { isSuccess = false, Message = "Nu ai dreptul să ștergi acest comentariu." };

               reply.IsDeleted = true;

               var post = ctx.Posts.FirstOrDefault(p => p.Id == reply.PostId);
               if (post != null && post.CommentsCount > 0)
                    post.CommentsCount--;

               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Comentariu șters." };
          }

          // Legacy hard-delete kept for backward compat with existing /api/post route.
          // Routes through soft delete to honor the spec while preserving the old call site.
          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id == id && !p.IsDeleted);
               if (post == null)
                    return new ServiceResponse { isSuccess = false, Message = "Postarea nu a fost găsită." };
               post.IsDeleted = true;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Postare ștearsă." };
          }
     }
}
