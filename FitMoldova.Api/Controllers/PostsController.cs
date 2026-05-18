using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Notification;
using FitMoldova.Domain.Models.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FitMoldova.Api.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostsController : ControllerBase
    {
        private readonly IPostLogic _postLogic;
        private readonly IHubContext<NotificationHub> _hubContext;

        public PostsController(IMapper mapper, IHubContext<NotificationHub> hubContext)
        {
            var bl     = new FitMoldova.BusinessLogic.BusinessLogic(mapper);
            _postLogic = bl.PostLogic();
            _hubContext = hubContext;
        }

        // Citeste rolul robust (ASP.NET Core remapeaza "role" la ClaimTypes.Role)
        private string GetRole() =>
            User.Claims.FirstOrDefault(c => c.Type == "role" || c.Type.EndsWith("/role"))?.Value
            ?? string.Empty;

        [HttpGet]
        public IActionResult GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] int? clubId = null)
            => Ok(_postLogic.GetAllPaged(page, pageSize, clubId));

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var r = _postLogic.GetById(id);
            return r.isSuccess ? Ok(r) : NotFound(r);
        }

        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] PostCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var role   = GetRole();

            // Doar Admin/Moderator poate posta in cluburi
            if (dto.ClubId.HasValue && role != "Admin" && role != "Moderator")
                return Forbid();

            dto.UserId = userId;
            var result = _postLogic.CreatePost(dto);
            if (!result.isSuccess) return BadRequest(result);

            // Notificari in background -- complet izolat, nu afecteaza raspunsul
            if (dto.ClubId.HasValue && result.Data is PostCreateResultDto createResult)
            {
                var postId = createResult.PostId;
                var clubId = dto.ClubId.Value;

                Task.Run(() => SendClubPostNotifications(postId, clubId, userId, _hubContext));
            }

            return StatusCode(201, result);
        }

        // Metoda statica -- nu captureaza nimic din controller (nu e risc de disposed objects)
        private static async Task SendClubPostNotifications(
            int postId, int clubId, int fromUserId,
            IHubContext<NotificationHub> hub)
        {
            try
            {
                var cs = DbSession.ConnectionString;
                if (string.IsNullOrEmpty(cs)) return;

                var opts = new DbContextOptionsBuilder<FitMoldovaContext>()
                    .UseNpgsql(cs).Options;

                await using var ctx = new FitMoldovaContext(opts);

                var memberIds = await ctx.ClubMembers
                    .Where(cm => cm.ClubId == clubId && cm.UserId != fromUserId)
                    .Select(cm => cm.UserId)
                    .ToListAsync();

                if (memberIds.Count == 0) return;

                var clubName = await ctx.Clubs
                    .Where(c => c.Id == clubId)
                    .Select(c => c.Name)
                    .FirstOrDefaultAsync() ?? "club";

                var author = await ctx.Users
                    .Where(u => u.Id == fromUserId)
                    .Select(u => new { u.FirstName, u.LastName })
                    .FirstOrDefaultAsync();

                var authorName = author != null
                    ? $"{author.FirstName} {author.LastName}".Trim()
                    : "Admin";

                var content = $"{authorName} a adăugat o postare nouă în clubul \"{clubName}\".";
                var now     = DateTime.UtcNow;

                // Salvam notificarile in DB
                try
                {
                    ctx.Notifications.AddRange(memberIds.Select(uid => new NotificationEntity
                    {
                        UserId     = uid,
                        FromUserId = fromUserId,
                        Type       = "club_post",
                        Content    = content,
                        PostId     = postId,
                        ClubId     = clubId,
                        IsRead     = false,
                        CreatedAt  = now,
                    }));
                    await ctx.SaveChangesAsync();
                }
                catch
                {
                    // Fallback: fara PostId/ClubId (daca migrarea nu a fost rulatata)
                    ctx.ChangeTracker.Clear();
                    ctx.Notifications.AddRange(memberIds.Select(uid => new NotificationEntity
                    {
                        UserId     = uid,
                        FromUserId = fromUserId,
                        Type       = "club_post",
                        Content    = content,
                        IsRead     = false,
                        CreatedAt  = now,
                    }));
                    await ctx.SaveChangesAsync();
                }

                // Push SignalR
                var push = new { type = "club_post", content, postId, clubId, fromUserId, createdAt = now };
                await Task.WhenAll(memberIds.Select(uid =>
                    hub.Clients.Group($"user_{uid}").SendAsync("ReceiveNotification", push)));
            }
            catch { /* silentios -- nu afecteaza clientul */ }
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update(int id, [FromBody] PostUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.UpdatePost(id, userId, GetRole(), dto);
            if (!r.isSuccess)
            {
                if (r.Message?.Contains("nu a fost găsită") == true) return NotFound(r);
                if (r.Message?.Contains("Nu ai dreptul") == true)    return Forbid();
                return BadRequest(r);
            }
            return Ok(r);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.SoftDelete(id, userId, GetRole());
            if (!r.isSuccess)
            {
                if (r.Message?.Contains("nu a fost găsită") == true) return NotFound(r);
                if (r.Message?.Contains("Nu ai dreptul") == true)    return Forbid();
                return BadRequest(r);
            }
            return NoContent();
        }

        [HttpGet("{id}/comments")]
        public IActionResult GetComments(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var r = _postLogic.GetCommentsPaged(id, page, pageSize);
            return r.isSuccess ? Ok(r) : NotFound(r);
        }

        [HttpPost("{id}/comments")]
        [Authorize]
        public IActionResult AddComment(int id, [FromBody] CommentCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.AddComment(id, userId, dto.Content);
            if (!r.isSuccess)
            {
                if (r.Message?.Contains("nu a fost găsită") == true) return NotFound(r);
                return BadRequest(r);
            }
            return StatusCode(201, r);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetByUser(int userId) => Ok(_postLogic.GetByUser(userId));

        [HttpPost("{id}/like")]
        [Authorize]
        public IActionResult Like(int id)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.LikePost(id, userId);
            return r.isSuccess ? Ok(r) : NotFound(r);
        }

        [HttpGet("bookmarked")]
        [Authorize]
        public IActionResult GetBookmarked()
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            return Ok(_postLogic.GetBookmarkedPosts(userId));
        }

        [HttpPost("{id}/bookmark")]
        [Authorize]
        public IActionResult Bookmark(int id)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.BookmarkPost(id, userId);
            return r.isSuccess ? Ok(r) : NotFound(r);
        }

        [HttpDelete("{id}/bookmark")]
        [Authorize]
        public IActionResult RemoveBookmark(int id)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.UnbookmarkPost(id, userId);
            if (!r.isSuccess) return NotFound(r);
            return NoContent();
        }

        [HttpPost("{id}/repost")]
        [Authorize]
        public IActionResult Repost(int id)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.RepostPost(id, userId);
            return r.isSuccess ? Ok(r) : NotFound(r);
        }

        [HttpPost("{id}/poll-vote")]
        [Authorize]
        public IActionResult PollVote(int id, [FromBody] PollVoteDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var r = _postLogic.VotePoll(id, userId, dto.OptionIndex);
            return r.isSuccess ? Ok(r) : BadRequest(r);
        }
    }
}