using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Post;
using FitMoldova.Domain.Models.Common;
using FitMoldova.Domain.Models.Post;
using FitMoldova.Domain.Models.Services;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;

namespace FitMoldova.BusinessLogic.Core
{
     public class PostAction
     {
          private readonly DbSession _dbSession = new DbSession();
          private const int MaxPageSize = 100;

          private const long MaxImageSizeBytes = 5 * 1024 * 1024;
          private static readonly HashSet<string> AllowedImageExtensions =
               new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };

          private static (int page, int pageSize) NormalizePaging(int page, int pageSize)
          {
               if (page < 1) page = 1;
               if (pageSize < 1) pageSize = 20;
               if (pageSize > MaxPageSize) pageSize = MaxPageSize;
               return (page, pageSize);
          }

          public ServiceResponse GetAllExecution(int? currentUserId = null)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = ctx.Posts.Where(p => !p.IsDeleted).OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId, AttachedChallengeId=p.AttachedChallengeId, AttachedChallengeProgress=p.AttachedChallengeProgress, AttachedChallengeName=p.AttachedChallenge != null ? p.AttachedChallenge.Name : null, ImageUrl=p.ImageUrl, ImageThumbnailUrl=p.ImageThumbnailUrl, Poll = p.Poll == null ? null : new PostPollDto { Id=p.Poll.Id, Question=p.Poll.Question, Options=p.Poll.Options.OrderBy(o=>o.Id).Select(o=>new PostPollOptionDto{ Id=o.Id, Text=o.Text, Votes=o.VotesCount }).ToList(), TotalVotes=p.Poll.Options.Sum(o=>o.VotesCount), Voted = currentUserId != null && ctx.PostPollVotes.Any(v => v.PostId==p.Id && v.UserId==currentUserId) } }).ToList();
               return new ServiceResponse { isSuccess=true, Data=posts };
          }

          public ServiceResponse GetAllPagedExecution(int page, int pageSize, int? clubId, int? currentUserId = null)
          {
               (page, pageSize) = NormalizePaging(page, pageSize);
               using var ctx = _dbSession.FitMoldovaContext();
               var query = ctx.Posts.Where(p => !p.IsDeleted);
               if (clubId.HasValue) query = query.Where(p => p.ClubId == clubId.Value);
               var totalCount = query.Count();
               var items = query.OrderByDescending(p => p.CreatedAt).Skip((page-1)*pageSize).Take(pageSize)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId, AttachedChallengeId=p.AttachedChallengeId, AttachedChallengeProgress=p.AttachedChallengeProgress, AttachedChallengeName=p.AttachedChallenge != null ? p.AttachedChallenge.Name : null, ImageUrl=p.ImageUrl, ImageThumbnailUrl=p.ImageThumbnailUrl, Poll = p.Poll == null ? null : new PostPollDto { Id=p.Poll.Id, Question=p.Poll.Question, Options=p.Poll.Options.OrderBy(o=>o.Id).Select(o=>new PostPollOptionDto{ Id=o.Id, Text=o.Text, Votes=o.VotesCount }).ToList(), TotalVotes=p.Poll.Options.Sum(o=>o.VotesCount), Voted = currentUserId != null && ctx.PostPollVotes.Any(v => v.PostId==p.Id && v.UserId==currentUserId) } }).ToList();
               return new ServiceResponse { isSuccess=true, Data=new PagedResultDto<PostInfoDto>{ Items=items, Page=page, PageSize=pageSize, TotalCount=totalCount } };
          }

          public ServiceResponse GetByUserExecution(int userId, int? currentUserId = null)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = ctx.Posts.Where(p => p.UserId==userId && !p.IsDeleted).OrderByDescending(p => p.CreatedAt)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId, AttachedChallengeId=p.AttachedChallengeId, AttachedChallengeProgress=p.AttachedChallengeProgress, AttachedChallengeName=p.AttachedChallenge != null ? p.AttachedChallenge.Name : null, ImageUrl=p.ImageUrl, ImageThumbnailUrl=p.ImageThumbnailUrl, Poll = p.Poll == null ? null : new PostPollDto { Id=p.Poll.Id, Question=p.Poll.Question, Options=p.Poll.Options.OrderBy(o=>o.Id).Select(o=>new PostPollOptionDto{ Id=o.Id, Text=o.Text, Votes=o.VotesCount }).ToList(), TotalVotes=p.Poll.Options.Sum(o=>o.VotesCount), Voted = currentUserId != null && ctx.PostPollVotes.Any(v => v.PostId==p.Id && v.UserId==currentUserId) } }).ToList();
               return new ServiceResponse { isSuccess=true, Data=posts };
          }

          public ServiceResponse GetByIdExecution(int id, int? currentUserId = null)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var p = ctx.Posts.Where(x => x.Id==id && !x.IsDeleted)
                   .Select(p => new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=p.User.FirstName+" "+p.User.LastName, AuthorUsername=p.User.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId, AttachedChallengeId=p.AttachedChallengeId, AttachedChallengeProgress=p.AttachedChallengeProgress, AttachedChallengeName=p.AttachedChallenge != null ? p.AttachedChallenge.Name : null, ImageUrl=p.ImageUrl, ImageThumbnailUrl=p.ImageThumbnailUrl, Poll = p.Poll == null ? null : new PostPollDto { Id=p.Poll.Id, Question=p.Poll.Question, Options=p.Poll.Options.OrderBy(o=>o.Id).Select(o=>new PostPollOptionDto{ Id=o.Id, Text=o.Text, Votes=o.VotesCount }).ToList(), TotalVotes=p.Poll.Options.Sum(o=>o.VotesCount), Voted = currentUserId != null && ctx.PostPollVotes.Any(v => v.PostId==p.Id && v.UserId==currentUserId) } }).FirstOrDefault();
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

               // ── Challenge atașat (opțional) ──
               // Validăm că userul curent e înscris la challenge și preluăm progresul REAL din DB.
               // Dacă nu e înscris (sau challenge inexistent), câmpurile rămân null.
               int? attachedChallengeId = null;
               int? attachedChallengeProgress = null;
               if (dto.AttachedChallengeId.HasValue)
               {
                    var ch = ctx.Challenges.FirstOrDefault(c => c.Id == dto.AttachedChallengeId.Value);
                    var participant = ctx.ChallengeParticipants
                         .FirstOrDefault(cp => cp.ChallengeId == dto.AttachedChallengeId.Value && cp.UserId == dto.UserId);
                    if (ch != null && participant != null)
                    {
                         attachedChallengeId = ch.Id;
                         attachedChallengeProgress = ChallengeAction.ComputeProgressPercent(ch.Duration, participant.JoinedAt);
                    }
               }

               var entity = new PostEntity
               {
                    UserId = dto.UserId,
                    Content = dto.Content,
                    Sport = dto.Sport ?? string.Empty,
                    ClubId = dto.ClubId,
                    CreatedAt = DateTime.UtcNow,
                    AttachedChallengeId = attachedChallengeId,
                    AttachedChallengeProgress = attachedChallengeProgress,
                    ImageUrl = dto.ImageUrl,
                    ImageThumbnailUrl = dto.ImageThumbnailUrl,
               };

               // ── Sondaj opțional ──
               // Acceptă poll.options sau pollOptions (formă plată). Minim 2, maxim 4 opțiuni.
               var pollOptionTexts = (dto.Poll?.Options ?? dto.PollOptions)
                    ?.Select(o => o?.Trim())
                    .Where(o => !string.IsNullOrEmpty(o))
                    .Select(o => o!)
                    .ToList();
               if (pollOptionTexts is { Count: >= 2 and <= 4 })
               {
                    var question = dto.Poll?.Question?.Trim();
                    entity.Poll = new PollEntity
                    {
                         Question = string.IsNullOrEmpty(question) ? null : question,
                         Options = pollOptionTexts
                              .Select(t => new PollOptionEntity { Text = t, VotesCount = 0 })
                              .ToList()
                    };
               }

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

          // ── UPLOAD IMAGINE POST ──
          // Refolosește EXACT pattern-ul din GalleryAction: validare extensie/dimensiune,
          // procesare cu ImageProcessor (ImageSharp → WebP q82 + thumbnail), upload .webp în Cloudinary.
          // Reutilizează aceeași instanță Cloudinary configurată la startup (GalleryAction.CloudinaryInstance).
          public ServiceResponse UploadImageExecution(IFormFile file)
          {
               if (file == null || file.Length == 0)
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul lipsește." };
               if (file.Length > MaxImageSizeBytes)
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul depășește limita de 5 MB." };

               var ext = Path.GetExtension(file.FileName);
               if (string.IsNullOrEmpty(ext) || !AllowedImageExtensions.Contains(ext))
                    return new ServiceResponse { isSuccess = false, Message = "Extensie nepermisă. Sunt acceptate: .jpg, .jpeg, .png, .webp." };

               var cloudinary = GalleryAction.CloudinaryInstance;
               if (cloudinary == null)
                    return new ServiceResponse { isSuccess = false, Message = "Cloudinary nu este configurat pe server." };

               MemoryStream webpStream;
               MemoryStream thumbStream;
               try
               {
                    using var inputStream = file.OpenReadStream();
                    (webpStream, thumbStream, _, _) = ImageProcessor.Process(inputStream);
               }
               catch (UnknownImageFormatException)
               {
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul nu este o imagine validă." };
               }
               catch (Exception ex)
               {
                    return new ServiceResponse { isSuccess = false, Message = $"Eroare la procesarea imaginii: {ex.Message}" };
               }

               var guid = Guid.NewGuid().ToString("N");
               string imageUrl, thumbUrl;
               try
               {
                    var uploadParams = new ImageUploadParams
                    {
                         File = new FileDescription($"{guid}.webp", webpStream),
                         PublicId = $"fitmoldova/posts/{guid}",
                         Overwrite = false,
                    };
                    var uploadResult = cloudinary.Upload(uploadParams);
                    if (uploadResult.Error != null)
                         return new ServiceResponse { isSuccess = false, Message = $"Cloudinary error: {uploadResult.Error.Message}" };
                    imageUrl = uploadResult.SecureUrl.ToString();

                    var thumbParams = new ImageUploadParams
                    {
                         File = new FileDescription($"{guid}_thumb.webp", thumbStream),
                         PublicId = $"fitmoldova/posts/thumbs/{guid}_thumb",
                         Overwrite = false,
                    };
                    var thumbResult = cloudinary.Upload(thumbParams);
                    if (thumbResult.Error != null)
                         return new ServiceResponse { isSuccess = false, Message = $"Cloudinary thumb error: {thumbResult.Error.Message}" };
                    thumbUrl = thumbResult.SecureUrl.ToString();
               }
               catch (Exception ex)
               {
                    return new ServiceResponse { isSuccess = false, Message = $"Eroare la upload Cloudinary: {ex.Message}" };
               }
               finally
               {
                    webpStream.Dispose();
                    thumbStream.Dispose();
               }

               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Imagine încărcată cu succes.",
                    Data = new { imageUrl, thumbnailUrl = thumbUrl }
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
               int? currentUserId = userId; // voted reflectă userul curent (proprietarul bookmark-urilor)
               using var ctx = _dbSession.FitMoldovaContext();
               var posts = (from b in ctx.PostBookmarks join p in ctx.Posts on b.PostId equals p.Id
                            join u in ctx.Users on p.UserId equals u.Id
                            where b.UserId==userId && !p.IsDeleted orderby b.CreatedAt descending
                            select new PostInfoDto { Id=p.Id, UserId=p.UserId, AuthorName=u.FirstName+" "+u.LastName, AuthorUsername=u.Username, Content=p.Content, Sport=p.Sport, Likes=p.Likes, CommentsCount=p.CommentsCount, CreatedAt=p.CreatedAt, ClubId=p.ClubId, AttachedChallengeId=p.AttachedChallengeId, AttachedChallengeProgress=p.AttachedChallengeProgress, AttachedChallengeName=p.AttachedChallenge != null ? p.AttachedChallenge.Name : null, ImageUrl=p.ImageUrl, ImageThumbnailUrl=p.ImageThumbnailUrl, Poll = p.Poll == null ? null : new PostPollDto { Id=p.Poll.Id, Question=p.Poll.Question, Options=p.Poll.Options.OrderBy(o=>o.Id).Select(o=>new PostPollOptionDto{ Id=o.Id, Text=o.Text, Votes=o.VotesCount }).ToList(), TotalVotes=p.Poll.Options.Sum(o=>o.VotesCount), Voted = currentUserId != null && ctx.PostPollVotes.Any(v => v.PostId==p.Id && v.UserId==currentUserId) } }).ToList();
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

               // Sondaj normalizat (Poll/PollOption) — sursa canonică.
               var poll = ctx.Polls.FirstOrDefault(p => p.PostId==postId);

               if (poll==null && string.IsNullOrEmpty(post.PollOptions))
                    return new ServiceResponse { isSuccess=false, Message="Postarea nu are sondaj." };

               // Protecție anti-dublu-vot (index unic UserId+PostId pe PostPollVotes).
               if (ctx.PostPollVotes.Any(v => v.PostId==postId && v.UserId==userId))
                    return new ServiceResponse { isSuccess=false, Message="Ai votat deja la acest sondaj." };

               if (poll!=null)
               {
                    var options = ctx.PollOptions.Where(o => o.PollId==poll.Id).OrderBy(o => o.Id).ToList();
                    if (optionIndex < 0 || optionIndex >= options.Count)
                         return new ServiceResponse { isSuccess=false, Message="Opțiune invalidă." };

                    ctx.PostPollVotes.Add(new PostPollVoteEntity { PostId=postId, UserId=userId, OptionIndex=optionIndex, CreatedAt=DateTime.UtcNow });
                    options[optionIndex].VotesCount++;
                    ctx.SaveChanges();

                    var data = new
                    {
                         options = options.Select(o => new { o.Id, o.Text, votes = o.VotesCount }).ToList(),
                         totalVotes = options.Sum(o => o.VotesCount),
                         voted = true
                    };
                    return new ServiceResponse { isSuccess=true, Message="Vot înregistrat.", Data=data };
               }

               // Fallback: sondaj legacy stocat ca JSON în Post.PollOptions.
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
