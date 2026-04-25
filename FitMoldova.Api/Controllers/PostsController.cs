using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitMoldova.Api.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostsController : ControllerBase
    {
        private readonly IPostLogic _postLogic;

        public PostsController(IMapper mapper)
        {
            var bl = new FitMoldova.BusinessLogic.BusinessLogic(mapper);
            _postLogic = bl.PostLogic();
        }

        // GET /api/posts?page=1&pageSize=20&clubId=3
        [HttpGet]
        public IActionResult GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] int? clubId = null)
        {
            var result = _postLogic.GetAllPaged(page, pageSize, clubId);
            return Ok(result);
        }

        // GET /api/posts/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _postLogic.GetById(id);
            if (!result.isSuccess) return NotFound(result);
            return Ok(result);
        }

        // POST /api/posts
        [HttpPost]
        [Authorize]
        public IActionResult Create([FromBody] PostCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            dto.UserId = userId;

            var result = _postLogic.CreatePost(dto);
            if (!result.isSuccess) return BadRequest(result);
            return StatusCode(201, result);
        }

        // PUT /api/posts/{id}
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update(int id, [FromBody] PostUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var role = User.FindFirst("role")?.Value ?? string.Empty;

            var result = _postLogic.UpdatePost(id, userId, role, dto);
            if (!result.isSuccess)
            {
                if (result.Message?.Contains("nu a fost găsită") == true)
                    return NotFound(result);
                if (result.Message?.Contains("Nu ai dreptul") == true)
                    return Forbid();
                return BadRequest(result);
            }
            return Ok(result);
        }

        // DELETE /api/posts/{id}  (soft delete)
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var role = User.FindFirst("role")?.Value ?? string.Empty;

            var result = _postLogic.SoftDelete(id, userId, role);
            if (!result.isSuccess)
            {
                if (result.Message?.Contains("nu a fost găsită") == true)
                    return NotFound(result);
                if (result.Message?.Contains("Nu ai dreptul") == true)
                    return Forbid();
                return BadRequest(result);
            }
            return NoContent();
        }

        // GET /api/posts/{id}/comments?page=1&pageSize=20
        [HttpGet("{id}/comments")]
        public IActionResult GetComments(int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = _postLogic.GetCommentsPaged(id, page, pageSize);
            if (!result.isSuccess) return NotFound(result);
            return Ok(result);
        }

        // POST /api/posts/{id}/comments
        [HttpPost("{id}/comments")]
        [Authorize]
        public IActionResult AddComment(int id, [FromBody] CommentCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);

            var result = _postLogic.AddComment(id, userId, dto.Content);
            if (!result.isSuccess)
            {
                if (result.Message?.Contains("nu a fost găsită") == true)
                    return NotFound(result);
                return BadRequest(result);
            }
            return StatusCode(201, result);
        }
    }
}
