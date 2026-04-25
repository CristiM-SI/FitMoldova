using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/post")]
public class PostController : ControllerBase
{
     private readonly IPostLogic _postLogic;

     public PostController(IMapper mapper)
     {
          var bl = new BusinessLogic(mapper);
          _postLogic = bl.PostLogic();
     }
     // GET api/post
     // Returnează toate postările — folosit de feed-ul comunității
     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _postLogic.GetAll();
          return Ok(result);
     }

     // GET api/post/42
     // Returnează postul + reply-urile lui — folosit la deschiderea unui thread
     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _postLogic.GetById(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     // GET api/post/user/5
     // Postările unui user specific — folosit pe pagina de profil
     [HttpGet("user/{userId}")]
     public IActionResult GetByUser(int userId)
     {
          var result = _postLogic.GetByUser(userId);
          return Ok(result);
     }

     // POST api/post
     // Creare post nou din feed/forum
     [HttpPost]
     public IActionResult Create([FromBody] PostCreateDto dto)
     {
          var result = _postLogic.CreatePost(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     // POST api/post/42/like/5
     // User cu ID 5 dă like la postul cu ID 42
     [HttpPost("{id}/like")]
     [Authorize]
     public IActionResult Like(int id)
     {
          var userId = int.Parse(User.FindFirst("userId")!.Value);
          var result = _postLogic.LikePost(id, userId);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     // POST api/post/reply
     // Adaugă un comentariu/reply la un post existent
     [HttpPost("reply")]
     public IActionResult AddReply([FromBody] PostReplyCreateDto dto)
     {
          var result = _postLogic.AddReply(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     // DELETE api/post/42
     // Șterge postul + toate reply-urile lui
     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _postLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
}