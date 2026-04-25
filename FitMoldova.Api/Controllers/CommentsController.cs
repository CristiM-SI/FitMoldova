using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitMoldova.Api.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentsController : ControllerBase
    {
        private readonly IPostLogic _postLogic;

        public CommentsController(IMapper mapper)
        {
            var bl = new FitMoldova.BusinessLogic.BusinessLogic(mapper);
            _postLogic = bl.PostLogic();
        }

        // DELETE /api/comments/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            var userId = int.Parse(User.FindFirst("userId")!.Value);
            var role = User.FindFirst("role")?.Value ?? string.Empty;

            var result = _postLogic.DeleteComment(id, userId, role);
            if (!result.isSuccess)
            {
                if (result.Message?.Contains("nu a fost găsit") == true)
                    return NotFound(result);
                if (result.Message?.Contains("Nu ai dreptul") == true)
                    return Forbid();
                return BadRequest(result);
            }
            return NoContent();
        }
    }
}
