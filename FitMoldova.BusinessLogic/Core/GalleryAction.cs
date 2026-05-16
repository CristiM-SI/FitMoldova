using System.Text.Json;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Gallery;
using FitMoldova.Domain.Models.Gallery;
using FitMoldova.Domain.Models.Services;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;

namespace FitMoldova.BusinessLogic.Core
{
    public class GalleryAction
    {
        private readonly DbSession _dbSession = new DbSession();

        // Cloudinary e injectat din exterior (setat o dată la startup)
        public static Cloudinary? CloudinaryInstance { get; set; }

        private const long MaxFileSizeBytes = 5 * 1024 * 1024;
        private const int ThumbnailSize = 300;
        private const int MaxOriginalWidth = 1920;
        private const int WebpQuality = 82;

        private static readonly HashSet<string> AllowedExtensions =
            new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };

        private static readonly string[] AllowedCategories =
            { "Antrenament", "Competiții", "Nutriție", "Recuperare", "Evenimente", "Altele" };

        // ──────────────────────────── UPLOAD ────────────────────────────────
        public ServiceResponse UploadExecution(GalleryCreateDto dto, IFormFile file, int uploadedByUserId, string webRootPath)
        {
            // ── Validare metadate ──
            if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Trim().Length < 3)
                return Fail("Titlul trebuie să aibă cel puțin 3 caractere.");
            if (dto.Title.Length > 100)
                return Fail("Titlul nu poate depăși 100 de caractere.");
            if (dto.Description.Length > 500)
                return Fail("Descrierea nu poate depăși 500 de caractere.");
            if (!AllowedCategories.Contains(dto.Category))
                return Fail($"Categorie invalidă.");
            if (dto.Tags.Count > 10)
                return Fail("Maxim 10 tag-uri per imagine.");
            if (dto.Tags.Any(t => string.IsNullOrWhiteSpace(t) || t.Length > 30))
                return Fail("Fiecare tag trebuie să aibă între 1 și 30 de caractere.");

            // ── Validare fișier ──
            if (file == null || file.Length == 0)
                return Fail("Fișierul lipsește.");
            if (file.Length > MaxFileSizeBytes)
                return Fail($"Fișierul depășește limita de 5 MB.");

            var ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
                return Fail("Extensie nepermisă. Sunt acceptate: .jpg, .jpeg, .png, .webp.");

            if (CloudinaryInstance == null)
                return Fail("Cloudinary nu este configurat pe server.");
            
            // ── Procesare cu ImageSharp → stream WebP ──
            MemoryStream webpStream;
            MemoryStream thumbStream;
            int width, height;

            try
            {
                 using var inputStream = file.OpenReadStream();
                 (webpStream, thumbStream, width, height) = ImageProcessor.Process(inputStream);
            }
            catch (UnknownImageFormatException)
            {
                 return Fail("Fișierul nu este o imagine validă.");
            }
            catch (Exception ex)
            {
                 return Fail($"Eroare la procesarea imaginii: {ex.Message}");
            }

            // ── Upload la Cloudinary ──
            var guid = Guid.NewGuid().ToString("N");

            string imageUrl, thumbUrl;
            long finalSize;

            try
            {
                // Upload original
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription($"{guid}.webp", webpStream),
                    PublicId = $"fitmoldova/gallery/{guid}",
                    Overwrite = false,
                    // Cloudinary păstrează formatul trimis (webp) — nu re-encode
                };
                var uploadResult = CloudinaryInstance.Upload(uploadParams);

                if (uploadResult.Error != null)
                    return Fail($"Cloudinary error: {uploadResult.Error.Message}");

                imageUrl = uploadResult.SecureUrl.ToString();
                finalSize = uploadResult.Bytes;

                // Upload thumbnail
                var thumbParams = new ImageUploadParams
                {
                    File = new FileDescription($"{guid}_thumb.webp", thumbStream),
                    PublicId = $"fitmoldova/gallery/thumbs/{guid}_thumb",
                    Overwrite = false,
                };
                var thumbResult = CloudinaryInstance.Upload(thumbParams);

                if (thumbResult.Error != null)
                    return Fail($"Cloudinary thumb error: {thumbResult.Error.Message}");

                thumbUrl = thumbResult.SecureUrl.ToString();
            }
            catch (Exception ex)
            {
                return Fail($"Eroare la upload Cloudinary: {ex.Message}");
            }
            finally
            {
                webpStream.Dispose();
                thumbStream.Dispose();
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
                ImageUrl = imageUrl,       // URL absolut Cloudinary (https://res.cloudinary.com/...)
                ThumbnailUrl = thumbUrl,
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

        // ──────────────────────────── DELETE ────────────────────────────────
        public ServiceResponse DeleteExecution(int id, string webRootPath)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
            if (entity == null)
                return Fail($"Imaginea cu ID {id} nu există.");

            // Șterge din Cloudinary (best-effort)
            if (CloudinaryInstance != null)
            {
                try
                {
                    // Extragem PublicId din URL: fitmoldova/gallery/{guid}
                    var imagePublicId = ExtractCloudinaryPublicId(entity.ImageUrl);
                    var thumbPublicId = ExtractCloudinaryPublicId(entity.ThumbnailUrl);

                    if (imagePublicId != null)
                        CloudinaryInstance.Destroy(new DeletionParams(imagePublicId));
                    if (thumbPublicId != null)
                        CloudinaryInstance.Destroy(new DeletionParams(thumbPublicId));
                }
                catch
                {
                    // Nu blocăm ștergerea din DB dacă Cloudinary dă eroare
                }
            }

            ctx.Galleries.Remove(entity);
            ctx.SaveChanges();
            return new ServiceResponse { isSuccess = true, Message = "Imagine ștearsă." };
        }

        // ── Extrage public_id din URL Cloudinary ──
        // Ex: "https://res.cloudinary.com/mycloud/image/upload/v123/fitmoldova/gallery/abc.webp"
        //  → "fitmoldova/gallery/abc"
        private static string? ExtractCloudinaryPublicId(string url)
        {
            try
            {
                var uri = new Uri(url);
                // path: /mycloud/image/upload/v123456/fitmoldova/gallery/abc.webp
                var segments = uri.AbsolutePath.Split('/');
                // Găsim indexul după "upload"
                var uploadIdx = Array.IndexOf(segments, "upload");
                if (uploadIdx < 0) return null;
                // Sărim peste "upload" și versiune (v123456)
                var start = uploadIdx + 2;
                var relevant = segments.Skip(start).ToArray();
                var withExt = string.Join("/", relevant);
                // Scoatem extensia
                return Path.GetFileNameWithoutExtension(withExt) is { } name
                    ? string.Join("/", relevant.Take(relevant.Length - 1).Append(name))
                    : null;
            }
            catch { return null; }
        }

        // ── Restul metodelor rămân identice ──
        public ServiceResponse GetAllExecution()
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var items = ctx.Galleries
                .Where(g => g.IsPublished)
                .OrderByDescending(g => g.CreatedAt)
                .ToList()
                .Select(EntityToDto)
                .ToList();
            return new ServiceResponse { isSuccess = true, Data = items };
        }

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

        public ServiceResponse GetByIdExecution(int id)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
            if (entity == null)
                return Fail($"Imaginea cu ID {id} nu există.");
            return new ServiceResponse { isSuccess = true, Data = EntityToDto(entity) };
        }

        public ServiceResponse UpdateExecution(int id, GalleryUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Trim().Length < 3)
                return Fail("Titlul trebuie să aibă cel puțin 3 caractere.");
            if (!AllowedCategories.Contains(dto.Category))
                return Fail("Categorie invalidă.");
            if (dto.Tags.Count > 10)
                return Fail("Maxim 10 tag-uri per imagine.");

            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
            if (entity == null)
                return Fail($"Imaginea cu ID {id} nu există.");

            entity.Title = dto.Title.Trim();
            entity.Description = dto.Description.Trim();
            entity.Category = dto.Category;
            entity.TagsJson = JsonSerializer.Serialize(
                dto.Tags.Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)).ToList());
            entity.IsPublished = dto.IsPublished;
            ctx.SaveChanges();

            return new ServiceResponse { isSuccess = true, Message = "Imagine actualizată.", Data = EntityToDto(entity) };
        }

        public ServiceResponse TogglePublishedExecution(int id)
        {
            using var ctx = _dbSession.FitMoldovaContext();
            var entity = ctx.Galleries.FirstOrDefault(g => g.Id == id);
            if (entity == null)
                return Fail($"Imaginea cu ID {id} nu există.");
            entity.IsPublished = !entity.IsPublished;
            ctx.SaveChanges();
            return new ServiceResponse
            {
                isSuccess = true,
                Message = entity.IsPublished ? "Imagine publicată." : "Imagine ascunsă.",
                Data = EntityToDto(entity)
            };
        }

        private static ServiceResponse Fail(string msg) =>
            new() { isSuccess = false, Message = msg };

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
            if (string.IsNullOrWhiteSpace(json)) return new();
            try { return JsonSerializer.Deserialize<List<string>>(json) ?? new(); }
            catch { return new(); }
        }
    }
}