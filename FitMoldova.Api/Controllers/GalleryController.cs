using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Structure;
using FitMoldova.Domain.Models.Gallery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/gallery")]
public class GalleryController : ControllerBase
{
     private readonly GalleryLogic _galleryLogic;
     private readonly IWebHostEnvironment _env;

     public GalleryController(GalleryAction action, IWebHostEnvironment env)
     {
          // Instanțiem direct GalleryLogic pentru a păstra stilul celorlalte controllere
          // (ex. ContactController folosește BusinessLogic.ContactLogic()).
          // GalleryLogic moștenește GalleryAction, dar aici ne ajunge un singleton de shim:
          _galleryLogic = new GalleryLogic();
          _env = env;
     }

     // ─────────────────────── UPLOAD (Admin) ─────────────────────────────
     // IMPORTANT: multipart/form-data — frontend trimite FormData cu:
     //   file:    fișierul binar
     //   title:   string
     //   description: string
     //   category:    string
     //   tags:        JSON string "[\"tag1\",\"tag2\"]"
     [HttpPost("upload")]
     [Authorize(Roles = "Admin")]
     [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB hard cap la nivel de request (backup pentru validarea de 5MB din Action)
     public IActionResult Upload([FromForm] GalleryUploadForm form)
     {
          if (form.File == null)
               return BadRequest(new { isSuccess = false, Message = "Fișierul este obligatoriu." });

          // Parse tags din JSON string (FormData nu suportă array-uri native)
          List<string> tags = new();
          if (!string.IsNullOrWhiteSpace(form.Tags))
          {
               try { tags = System.Text.Json.JsonSerializer.Deserialize<List<string>>(form.Tags) ?? new(); }
               catch { return BadRequest(new { isSuccess = false, Message = "Tag-urile trebuie trimise ca JSON array." }); }
          }

          var dto = new GalleryCreateDto
          {
               Title = form.Title ?? "",
               Description = form.Description ?? "",
               Category = form.Category ?? "Altele",
               Tags = tags
          };

          var userId = int.Parse(User.FindFirst("userId")!.Value);
          // WebRootPath poate fi null dacă wwwroot nu există — fallback pe ContentRootPath
          var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");

          var result = _galleryLogic.Upload(dto, form.File, userId, webRoot);
          if (!result.isSuccess) return BadRequest(result);
          return StatusCode(201, result);
     }

     // ─────────────────────── GET ALL (public) ───────────────────────────
     [HttpGet]
     public IActionResult GetAll()
     {
          var result = _galleryLogic.GetAll();
          return Ok(result);
     }

     // ─────────────────── GET ALL ADMIN (incl. nepublicate) ─────────────
     [HttpGet("admin")]
     [Authorize(Roles = "Admin")]
     public IActionResult GetAllAdmin()
     {
          var result = _galleryLogic.GetAllAdmin();
          return Ok(result);
     }

     // ────────────────────────── GET BY ID ───────────────────────────────
     [HttpGet("{id}")]
     public IActionResult GetById(int id)
     {
          var result = _galleryLogic.GetById(id);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     // ──────────────────────────── UPDATE ────────────────────────────────
     [HttpPut("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Update(int id, [FromBody] GalleryUpdateDto dto)
     {
          var result = _galleryLogic.Update(id, dto);
          if (!result.isSuccess) return BadRequest(result);
          return Ok(result);
     }

     // ─────────────────────── TOGGLE PUBLISHED ──────────────────────────
     [HttpPut("{id}/toggle-published")]
     [Authorize(Roles = "Admin")]
     public IActionResult TogglePublished(int id)
     {
          var result = _galleryLogic.TogglePublished(id);
          if (!result.isSuccess) return NotFound(result);
          return Ok(result);
     }

     // ──────────────────────────── DELETE ────────────────────────────────
     [HttpDelete("{id}")]
     [Authorize(Roles = "Admin")]
     public IActionResult Delete(int id)
     {
          var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
          var result = _galleryLogic.Delete(id, webRoot);
          if (!result.isSuccess) return NotFound(result);
          return NoContent();
     }
}

/// <summary>
/// Model pentru bind-ul multipart. Nu-l ține în Domain.Models — e strict pentru controller.
/// </summary>
public class GalleryUploadForm
{
     public IFormFile? File { get; set; }
     public string? Title { get; set; }
     public string? Description { get; set; }
     public string? Category { get; set; }
     /// <summary>JSON array ca string, ex. "[\"outdoor\",\"cardio\"]"</summary>
     public string? Tags { get; set; }
}
