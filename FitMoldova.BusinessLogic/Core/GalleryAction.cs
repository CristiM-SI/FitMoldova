using System.Text.Json;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Gallery;
using FitMoldova.Domain.Models.Gallery;
using FitMoldova.Domain.Models.Services;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace FitMoldova.BusinessLogic.Core
{
     /// <summary>
     /// Action responsabil pentru galerie: upload, procesare imagini, CRUD metadate.
     /// Pattern idempotent: pe upload generăm GUID → fișier unic, deci re-upload-ul
     /// aceluiași original creează un rând DB diferit (intenționat).
     /// </summary>
     public class GalleryAction
     {
          private readonly DbSession _dbSession = new DbSession();

          // ─────────────────── Constante de configurare ───────────────────────
          private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB
          private const int ThumbnailSize = 300;                 // 300×300 square crop
          private const int MaxOriginalWidth = 1920;             // resize dacă e mai mare
          private const int WebpQuality = 82;                    // 0-100, 82 = sweet spot

          // MIME-uri permise — verificate după magic bytes, nu după Content-Type din request
          private static readonly HashSet<string> AllowedExtensions =
               new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };

          private static readonly string[] AllowedCategories =
               { "Antrenament", "Competiții", "Nutriție", "Recuperare", "Evenimente", "Altele" };

          // ──────────────────────────── UPLOAD ────────────────────────────────
          public ServiceResponse UploadExecution(GalleryCreateDto dto, IFormFile file, int uploadedByUserId, string webRootPath)
          {
               // ── Validare metadate ──
               if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Trim().Length < 3)
                    return new ServiceResponse { isSuccess = false, Message = "Titlul trebuie să aibă cel puțin 3 caractere." };
               if (dto.Title.Length > 100)
                    return new ServiceResponse { isSuccess = false, Message = "Titlul nu poate depăși 100 de caractere." };
               if (dto.Description.Length > 500)
                    return new ServiceResponse { isSuccess = false, Message = "Descrierea nu poate depăși 500 de caractere." };
               if (!AllowedCategories.Contains(dto.Category))
                    return new ServiceResponse { isSuccess = false, Message = $"Categorie invalidă. Valori permise: {string.Join(", ", AllowedCategories)}." };
               if (dto.Tags.Count > 10)
                    return new ServiceResponse { isSuccess = false, Message = "Maxim 10 tag-uri per imagine." };
               if (dto.Tags.Any(t => string.IsNullOrWhiteSpace(t) || t.Length > 30))
                    return new ServiceResponse { isSuccess = false, Message = "Fiecare tag trebuie să aibă între 1 și 30 de caractere." };

               // ── Validare fișier ──
               if (file == null || file.Length == 0)
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul lipsește." };
               if (file.Length > MaxFileSizeBytes)
                    return new ServiceResponse { isSuccess = false, Message = $"Fișierul depășește limita de {MaxFileSizeBytes / 1024 / 1024} MB." };

               var ext = Path.GetExtension(file.FileName);
               if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
                    return new ServiceResponse { isSuccess = false, Message = "Extensie nepermisă. Sunt acceptate: .jpg, .jpeg, .png, .webp." };

               // ── Pregătire foldere ──
               // webRootPath ajunge aici de la controller (app.Environment.WebRootPath sau ContentRootPath/wwwroot)
               var galleryDir = Path.Combine(webRootPath, "uploads", "gallery");
               var thumbDir = Path.Combine(webRootPath, "uploads", "gallery", "thumbs");
               Directory.CreateDirectory(galleryDir);
               Directory.CreateDirectory(thumbDir);

               var guid = Guid.NewGuid().ToString("N"); // 32 caractere hex, fără cratime
               var fileName = $"{guid}.webp";
               var thumbName = $"{guid}_thumb.webp";
               var filePath = Path.Combine(galleryDir, fileName);
               var thumbPath = Path.Combine(thumbDir, thumbName);

               int width, height;
               long finalSize;

               try
               {
                    // ── Procesare cu ImageSharp ──
                    // Load din stream → verifică magic bytes implicit. Dacă utilizatorul
                    // a pus script.js redenumit .jpg, ImageSharp aruncă UnknownImageFormatException.
                    using var stream = file.OpenReadStream();
                    using var image = Image.Load(stream);

                    width = image.Width;
                    height = image.Height;

                    // Resize proporțional dacă e prea lat (păstrăm aspect ratio)
                    if (width > MaxOriginalWidth)
                    {
                         var ratio = (double)MaxOriginalWidth / width;
                         var newHeight = (int)(height * ratio);
                         image.Mutate(x => x.Resize(MaxOriginalWidth, newHeight));
                         width = MaxOriginalWidth;
                         height = newHeight;
                    }

                    // Salvează original-ul ca WebP (lossy, quality 82)
                    image.Save(filePath, new WebpEncoder { Quality = WebpQuality });
                    finalSize = new FileInfo(filePath).Length;

                    // Generează thumbnail: crop centrat la 300×300
                    using var thumb = image.Clone(ctx => ctx.Resize(new ResizeOptions
                    {
                         Size = new Size(ThumbnailSize, ThumbnailSize),
                         Mode = ResizeMode.Crop // crop centrat (preia centrul)
                    }));
                    thumb.Save(thumbPath, new WebpEncoder { Quality = WebpQuality });
               }
               catch (UnknownImageFormatException)
               {
                    return new ServiceResponse { isSuccess = false, Message = "Fișierul nu este o imagine validă." };
               }
               catch (Exception ex)
               {
                    // Cleanup parțial: dacă s-a creat original dar nu thumbnail (sau invers), șterge ce există
                    if (File.Exists(filePath)) File.Delete(filePath);
                    if (File.Exists(thumbPath)) File.Delete(thumbPath);
                    return new ServiceResponse { isSuccess = false, Message = $"Eroare la procesarea imaginii: {ex.Message}" };
               }

               // ── Persistă în DB ──
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = new GalleryEntity
               {
                    Title = dto.Title.Trim(),
                    Description = dto.Description.Trim(),
                    Category = dto.Category,
                    TagsJson = JsonSerializer.Serialize(
                         dto.Tags.Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)).ToList()),
                    ImageUrl = $"/uploads/gallery/{fileName}",
                    ThumbnailUrl = $"/uploads/gallery/thumbs/{thumbName}",
                    FileSizeBytes = finalSize,
                    Width = width,
                    Height = height,
                    UploadedByUserId = uploadedByUserId,
                    CreatedAt = DateTime.UtcNow,
                    IsPublished = true
               };
               ctx.Galleries.Add(entity);
               ctx.SaveChanges();

               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = "Imagine adăugată cu succes.",
                    Data = EntityToDto(entity)
               };
          }

          // ──────────────────────── GET ALL (public) ──────────────────────────
          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var items = ctx.Galleries
                    .Where(g => g.IsPublished)
                    .OrderByDescending(g => g.CreatedAt)
                    .ToList() // materializează înainte de Select ca să putem deserializa JSON în memorie
                    .Select(EntityToDto)
                    .ToList();
               return new ServiceResponse { isSuccess = true, Data = items };
          }

          // ──────────────────── GET ALL ADMIN (publicat + nepublicat) ─────────
          public ServiceResponse GetAllAdminExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var items = ctx.Galleries
                    .OrderByDescending(g => g.CreatedAt)
                    .ToList()
                    .Select(EntityToDto)
                    .ToList();
               return new ServiceResponse { isSuccess = true, Data = items };
          }

          // ──────────────────────────── GET BY ID ─────────────────────────────
          public ServiceResponse GetByIdExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
               if (entity == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Imaginea cu ID {id} nu există." };
               return new ServiceResponse { isSuccess = true, Data = EntityToDto(entity) };
          }

          // ──────────────────────────── UPDATE ────────────────────────────────
          public ServiceResponse UpdateExecution(int id, GalleryUpdateDto dto)
          {
               if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Trim().Length < 3)
                    return new ServiceResponse { isSuccess = false, Message = "Titlul trebuie să aibă cel puțin 3 caractere." };
               if (!AllowedCategories.Contains(dto.Category))
                    return new ServiceResponse { isSuccess = false, Message = "Categorie invalidă." };
               if (dto.Tags.Count > 10)
                    return new ServiceResponse { isSuccess = false, Message = "Maxim 10 tag-uri per imagine." };

               using var ctx = _dbSession.FitMoldovaContext();
               var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
               if (entity == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Imaginea cu ID {id} nu există." };

               entity.Title = dto.Title.Trim();
               entity.Description = dto.Description.Trim();
               entity.Category = dto.Category;
               entity.TagsJson = JsonSerializer.Serialize(
                    dto.Tags.Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)).ToList());
               entity.IsPublished = dto.IsPublished;

               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Imagine actualizată.", Data = EntityToDto(entity) };
          }

          // ──────────────────────────── DELETE ────────────────────────────────
          public ServiceResponse DeleteExecution(int id, string webRootPath)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
               if (entity == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Imaginea cu ID {id} nu există." };

               // Șterge fișierele fizice (best-effort — dacă lipsesc, nu e blocant)
               try
               {
                    var imagePath = Path.Combine(webRootPath, entity.ImageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                    var thumbPath = Path.Combine(webRootPath, entity.ThumbnailUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                    if (File.Exists(imagePath)) File.Delete(imagePath);
                    if (File.Exists(thumbPath)) File.Delete(thumbPath);
               }
               catch
               {
                    // Log ar fi ideal aici, dar nu avem încă ILogger injectat — TODO
               }

               ctx.Galleries.Remove(entity);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Imagine ștearsă." };
          }

          // ──────────────────── TOGGLE PUBLISHED ─────────────────────────────
          public ServiceResponse TogglePublishedExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
               if (entity == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Imaginea cu ID {id} nu există." };
               entity.IsPublished = !entity.IsPublished;
               ctx.SaveChanges();
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message = entity.IsPublished ? "Imagine publicată." : "Imagine ascunsă.",
                    Data = EntityToDto(entity)
               };
          }

          // ───────────────────────── Helper ──────────────────────────────────
          private static GalleryInfoDto EntityToDto(GalleryEntity e) => new()
          {
               Id = e.Id,
               Title = e.Title,
               Description = e.Description,
               Category = e.Category,
               Tags = DeserializeTags(e.TagsJson),
               ImageUrl = e.ImageUrl,
               ThumbnailUrl = e.ThumbnailUrl,
               FileSizeBytes = e.FileSizeBytes,
               Width = e.Width,
               Height = e.Height,
               UploadedByUserId = e.UploadedByUserId,
               CreatedAt = e.CreatedAt,
               IsPublished = e.IsPublished
          };

          private static List<string> DeserializeTags(string json)
          {
               if (string.IsNullOrWhiteSpace(json)) return new List<string>();
               try { return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>(); }
               catch { return new List<string>(); }
          }
     }
}
