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
               var posts = ctx.Posts.Where(p => !p.IsDeleted).OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId }).ToList();
               return new ServiceResponse { isSuccess=true, Data=posts };
          }

          public ServiceResponse GetAllPagedExecution(int page, int pageSize, int? clubId)
          {
               (page, pageSize) = NormalizePaging(page, pageSize);
               using var ctx = _dbSession.FitMoldovaContext();
               var query = ctx.Posts.Where(p => !p.IsDeleted);
               if (clubId.HasValue) query = query.Where(p => p.ClubId == clubId.Value);
               var totalCount = query.Count();
               var items = query.OrderByDescending(p => p.CreatedAt).Skip((page-1)*pageSize).Take(pageSize)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId }).ToList();
               return new ServiceResponse { isSuccess=true, Data=new PagedResultDto<PostInfoDto>{ Items=items, Page=page, PageSize=pageSize, TotalCount=totalCount } };
          }

          public ServiceResponse GetByUserExecution(int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = ctx.Posts.Where(p => p.UserId==userId && !p.IsDeleted).OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId }).ToList();
               return new ServiceResponse { isSuccess=true, Data=posts };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var p = ctx.Posts.Where(x => x.Id==id && !x.IsDeleted)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId }).FirstOrDefault();
               if (p == null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               return new ServiceResponse { isSuccess=true, Data=p };
          }

          // ── CREATE — returneaza postId pentru ca PostsController sa trimita SignalR ──
          // hubContext este injectat si folosit direct in PostsController, nu aici.
          // Aceasta metoda returneaza ID-ul postarii create + membrii clubului
          // ca PostsController sa poata trimite notificarile.

          public ServiceResponse CreatePostExecution(PostCreateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = new PostEntity { UserId=dto.UserId, Content=dto.Content, Sport=dto.Sport??string.Empty, ClubId=dto.ClubId, CreatedAt=DateTime.UtcNow };
               ctx.Posts.Add(entity);
               ctx.SaveChanges();

               // Returnam si date pentru notificari (postId, clubId, memberIds, clubName, authorName)
               // PostsController va face el SignalR + DB notifications
               List<int>? memberIds = null;
               string? clubName = null;
               string? authorName = null;

               if (dto.ClubId.HasValue)
               {
                    memberIds = ctx.ClubMembers
                         .Where(cm => cm.ClubId==dto.ClubId.Value && cm.UserId!=dto.UserId)
                         .Select(cm => cm.UserId).ToList();
                    clubName = ctx.Clubs.Where(c => c.Id==dto.ClubId.Value).Select(c => c.Name).FirstOrDefault();
                    var author = ctx.Users.Where(u => u.Id==dto.UserId).Select(u => new { u.FirstName, u.LastName }).FirstOrDefault();
                    authorName = author != null ? $"{author.FirstName} {author.LastName}".Trim() : "Cineva";
               }

               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Postare creată cu succes.",
                    Data = new PostCreateResultDto
                    {
                         PostId     = entity.Id,
                         ClubId     = dto.ClubId,
                         MemberIds  = memberIds,
                         ClubName   = clubName,
                         AuthorName = authorName,
                    }
               };
          }

          public ServiceResponse UpdatePostExecution(int postId, int userId, string role, PostUpdateDto dto)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = ctx.Posts.FirstOrDefault(p => p.Id==postId && !p.IsDeleted);
               if (entity==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               if (entity.UserId!=userId && !string.Equals(role,"Admin",StringComparison.OrdinalIgnoreCase))
                    return new ServiceResponse { isSuccess=false, Message="Nu ai dreptul să editezi această postare." };
               entity.Content=dto.Content??entity.Content; entity.Sport=dto.Sport??entity.Sport; entity.UpdatedAt=DateTime.UtcNow;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Postare actualizată." };
          }

          public ServiceResponse LikePostExecution(int postId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id==postId && !p.IsDeleted);
               if (post==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               post.Likes++; ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Like adăugat.", Data=post.Likes };
          }

          public ServiceResponse AddReplyExecution(PostReplyCreateDto dto)
          {
               if (string.IsNullOrWhiteSpace(dto.Content)) return new ServiceResponse { isSuccess=false, Message="Conținutul nu poate fi gol." };
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id==dto.PostId && !p.IsDeleted);
               if (post==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               var reply = new PostReplyEntity { PostId=dto.PostId, UserId=dto.UserId, Content=dto.Content, CreatedAt=DateTime.UtcNow };
               ctx.PostReplies.Add(reply); post.CommentsCount++; ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Reply adăugat.", Data=reply.Id };
          }

          public ServiceResponse AddCommentExecution(int postId, int userId, string content)
               => AddReplyExecution(new PostReplyCreateDto { PostId=postId, UserId=userId, Content=content });

          public ServiceResponse GetCommentsPagedExecution(int postId, int page, int pageSize)
          {
               (page, pageSize) = NormalizePaging(page, pageSize);
               using var ctx = _dbSession.FitMoldovaContext();
               if (!ctx.Posts.Any(p => p.Id==postId && !p.IsDeleted))
                    return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               var query = ctx.PostReplies.Where(r => r.PostId==postId && !r.IsDeleted);
               var totalCount = query.Count();
               var items = (from r in query join u in ctx.Users on r.UserId equals u.Id orderby r.CreatedAt
                            select new ReplyDto { Id=r.Id, PostId=r.PostId, UserId=r.UserId, AuthorName=u.FirstName+" "+u.LastName, AuthorUsername=u.Username, Content=r.Content, Likes=r.Likes, CreatedAt=r.CreatedAt })
                           .Skip((page-1)*pageSize).Take(pageSize).ToList();
               return new ServiceResponse { isSuccess=true, Data=new PagedResultDto<ReplyDto>{ Items=items, Page=page, PageSize=pageSize, TotalCount=totalCount } };
          }

          public ServiceResponse SoftDeleteExecution(int id, int userId, string role)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id==id && !p.IsDeleted);
               if (post==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               if (post.UserId!=userId && !string.Equals(role,"Admin",StringComparison.OrdinalIgnoreCase))
                    return new ServiceResponse { isSuccess=false, Message="Nu ai dreptul să ștergi această postare." };
               post.IsDeleted=true; ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Postare ștearsă." };
          }

          public ServiceResponse DeleteCommentExecution(int commentId, int userId, string role)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var reply = ctx.PostReplies.FirstOrDefault(r => r.Id==commentId && !r.IsDeleted);
               if (reply==null) return new ServiceResponse { isSuccess=false, Message="Comentariul nu a fost găsit." };
               if (reply.UserId!=userId && !string.Equals(role,"Admin",StringComparison.OrdinalIgnoreCase))
                    return new ServiceResponse { isSuccess=false, Message="Nu ai dreptul să ștergi acest comentariu." };
               reply.IsDeleted=true;
               var post = ctx.Posts.FirstOrDefault(p => p.Id==reply.PostId);
               if (post!=null && post.CommentsCount>0) post.CommentsCount--;
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Comentariu șters." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id==id && !p.IsDeleted);
               if (post==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               post.IsDeleted=true; ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Postare ștearsă." };
          }

          public ServiceResponse BookmarkPostExecution(int postId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var existing = ctx.PostBookmarks.FirstOrDefault(b => b.PostId==postId && b.UserId==userId);
               if (existing!=null) { ctx.PostBookmarks.Remove(existing); ctx.SaveChanges(); return new ServiceResponse { isSuccess=true, Message="Bookmark eliminat.", Data=false }; }
               var post = ctx.Posts.FirstOrDefault(p => p.Id==postId && !p.IsDeleted);
               if (post==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               ctx.PostBookmarks.Add(new PostBookmarkEntity { PostId=postId, UserId=userId, CreatedAt=DateTime.UtcNow });
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Bookmark adăugat.", Data=true };
          }

          public ServiceResponse UnbookmarkPostExecution(int postId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var existing = ctx.PostBookmarks.FirstOrDefault(b => b.PostId==postId && b.UserId==userId);
               if (existing==null) return new ServiceResponse { isSuccess=false, Message="Bookmark-ul nu există." };
               ctx.PostBookmarks.Remove(existing); ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Bookmark eliminat." };
          }

          public ServiceResponse GetBookmarkedPostsExecution(int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = (from b in ctx.PostBookmarks join p in ctx.Posts on b.PostId equals p.Id
                            join u in ctx.Users on p.UserId equals u.Id
                            where b.UserId==userId && !p.IsDeleted orderby b.CreatedAt descending
                            select new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=u.FirstName+" "+u.LastName, AuthorUsername=u.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId }).ToList();
               return new ServiceResponse { isSuccess=true, Data=posts };
          }

          public ServiceResponse RepostPostExecution(int postId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id==postId && !p.IsDeleted);
               if (post==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               var existing = ctx.PostReposts.FirstOrDefault(r => r.PostId==postId && r.UserId==userId);
               if (existing!=null) { ctx.PostReposts.Remove(existing); if(post.Reposts>0)post.Reposts--; ctx.SaveChanges(); return new ServiceResponse { isSuccess=true, Message="Repost eliminat.", Data=false }; }
               ctx.PostReposts.Add(new PostRepostEntity { PostId=postId, UserId=userId, CreatedAt=DateTime.UtcNow });
               post.Reposts++; ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Message="Repost adăugat.", Data=true };
          }

          public ServiceResponse VotePollExecution(int postId, int userId, int optionIndex)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var post = ctx.Posts.FirstOrDefault(p => p.Id==postId && !p.IsDeleted);
               if (post==null) return new ServiceResponse { isSuccess=false, Message="Postarea nu a fost găsită." };
               if (string.IsNullOrEmpty(post.PollOptions)) return new ServiceResponse { isSuccess=false, Message="Postarea nu are sondaj." };
               if (ctx.PostPollVotes.Any(v => v.PostId==postId && v.UserId==userId)) return new ServiceResponse { isSuccess=false, Message="Ai votat deja la acest sondaj." };
               ctx.PostPollVotes.Add(new PostPollVoteEntity { PostId=postId, UserId=userId, OptionIndex=optionIndex, CreatedAt=DateTime.UtcNow });
               ctx.SaveChanges();
               var distribution = ctx.PostPollVotes.Where(v => v.PostId==postId).GroupBy(v => v.OptionIndex).Select(g => new { OptionIndex=g.Key, Count=g.Count() }).ToList();
               return new ServiceResponse { isSuccess=true, Message="Vot înregistrat.", Data=distribution };
          }

          public ServiceResponse LikeCommentExecution(int commentId, int userId)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var reply = ctx.PostReplies.FirstOrDefault(r => r.Id==commentId && !r.IsDeleted);
               if (reply==null) return new ServiceResponse { isSuccess=false, Message="Comentariul nu a fost găsit." };
               var existing = ctx.PostReplyLikes.FirstOrDefault(l => l.ReplyId==commentId && l.UserId==userId);
               if (existing!=null) { ctx.PostReplyLikes.Remove(existing); if(reply.Likes>0)reply.Likes--; ctx.SaveChanges(); return new ServiceResponse { isSuccess=true, Data=new{liked=false,likes=reply.Likes} }; }
               ctx.PostReplyLikes.Add(new PostReplyLikeEntity { ReplyId=commentId, UserId=userId, CreatedAt=DateTime.UtcNow });
               reply.Likes++; ctx.SaveChanges();
               return new ServiceResponse { isSuccess=true, Data=new{liked=true,likes=reply.Likes} };
          }
     }
}
