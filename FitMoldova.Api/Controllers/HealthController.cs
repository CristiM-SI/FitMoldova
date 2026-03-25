using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Template;

namespace FitMoldova.Api.Controllers
{
     [Route("api/[controller]")]
     [ApiController]
     public class HealthController : ControllerBase
     {
          [HttpGet(template: "check")] 

        public IActionResult Check()
          {

               return Ok("Server is up and running");
          }
     }
}
