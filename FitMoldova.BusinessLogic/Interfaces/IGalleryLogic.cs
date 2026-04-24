using FitMoldova.Domain.Models.Gallery;
using FitMoldova.Domain.Models.Services;
using Microsoft.AspNetCore.Http;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IGalleryLogic
     {
          /// <summary>
          /// Primește fișierul + metadatele, validează MIME, convertește la WebP,
          /// generează thumbnail, salvează pe disk și persistă metadatele în DB.
          /// </summary>
          ServiceResponse Upload(GalleryCreateDto dto, IFormFile file, int uploadedByUserId, string webRootPath);

          /// <summary>Listă publică — doar IsPublished = true.</summary>
          ServiceResponse GetAll();

          /// <summary>Listă pentru admin — include și cele nepublicate.</summary>
          ServiceResponse GetAllAdmin();

          ServiceResponse GetById(int id);

          ServiceResponse Update(int id, GalleryUpdateDto dto);

          /// <summary>Șterge fișierul fizic (original + thumbnail) și rândul din DB.</summary>
          ServiceResponse Delete(int id, string webRootPath);

          ServiceResponse TogglePublished(int id);
     }
}
