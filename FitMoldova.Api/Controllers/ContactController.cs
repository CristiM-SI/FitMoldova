// ACCESS CONTROL SUMMARY:
// Public:             POST /api/contact (submit message, max 5/hour per IP)
// [Authorize(Admin)]: GET /api/contact, PUT /api/contact/{id}/read, DELETE /api/contact/{id}
using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Contact;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
     private readonly IContactLogic _contactLogic;

     public ContactController(IMapper mapper)
     {
          var bl = new BusinessLogic(mapper);
          _contactLogic = bl.ContactLogic();
     }

     // POST api/contact — public, rate-limited
     [HttpPost]
     [EnableRateLimiting("ContactFormPolicy")]
     public IActionResult Submit([FromBody] ContactMessageCreateDto dto)
     {
          var result = _contactLogic.Submit(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     // GET api/contact — admin only
     [HttpGet]
     [Authorize(Roles = "Admin")]
     public IActionResult GetAll()
     {
          var result = _contactLogic.GetAll();
          return Ok(result);
     }

     // PUT api/contact/{id}/read — admin only
     [HttpPut("{id}/read")]
     [Authorize(Roles = "Admin")]
     public IActionResult MarkAsRead(int id)
     {
          var result = _contactLogic.MarkAsRead(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     // DELETE api/contact/{id} — admin only
     [HttpDelete("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Delete(int id)
     {
          var result = _contactLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
}
