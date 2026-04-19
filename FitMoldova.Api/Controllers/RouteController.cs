using AutoMapper;
using FitMoldova.BusinessLogic;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Route;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/route")]
public class RouteController : ControllerBase
{
     private readonly IRouteLogic _routeLogic;

     public RouteController(IMapper mapper)
     {
          var bl = new BusinessLogic(mapper);
          _routeLogic = bl.RouteLogic();
     }

     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _routeLogic.GetAll();
          return Ok(result);
     }

   
     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _routeLogic.GetById(id);
          if (!result.isSuccess)
               return NotFound(result);
          return Ok(result);
     }

    
     [HttpPost]
     public IActionResult Create([FromBody] RouteCreateDto dto)
     {
          var result = _routeLogic.CreateRoute(dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

   
     [HttpPut("{id}")]
     public IActionResult Update(int id, [FromBody] RouteCreateDto dto)
     {
          var result = _routeLogic.Update(id, dto);
          if (!result.isSuccess)
               return BadRequest(result);
          return Ok(result);
     }

  
     [HttpDelete("{id}")]
     public IActionResult Delete(int id)
     {
          var result = _routeLogic.Delete(id);
          if (!result.isSuccess)
               return NotFound(result);
          return NoContent();
     }
}