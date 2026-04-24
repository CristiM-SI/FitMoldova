using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Contact;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

     // POST api/contact
     // Rută publică — oricine poate trimite un mesaj de contact (nu necesită auth)
     [HttpPost]
     public IActionResult Submit([FromBody] ContactMessageCreateDto dto)
     {
          var result = _contactLogic.Submit(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

     // GET api/contact
     // Returnează toate mesajele — doar admin
     [HttpGet]
     [Authorize(Roles = "Admin")]
     public IActionResult GetAll()
     {
          var result = _contactLogic.GetAll();
          return Ok(result);
     }

     // PUT api/contact/42/read
     // Marchează mesajul ca citit — doar admin
     [HttpPut("{id}/read")]
     [Authorize(Roles = "Admin")]
     public IActionResult MarkAsRead(int id)
     {
          var result = _contactLogic.MarkAsRead(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

     // DELETE api/contact/42
     // Șterge un mesaj — doar admin
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
