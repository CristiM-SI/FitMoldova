using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Gallery;
using FitMoldova.Domain.Models.Services;
using Microsoft.AspNetCore.Http;

namespace FitMoldova.BusinessLogic.Structure
{
     public class GalleryLogic : GalleryAction, IGalleryLogic
     {
          public ServiceResponse Upload(GalleryCreateDto dto, IFormFile file, int uploadedByUserId, string webRootPath)
               => UploadExecution(dto, file, uploadedByUserId, webRootPath);

          public ServiceResponse GetAll()              => GetAllExecution();
          public ServiceResponse GetAllAdmin()         => GetAllAdminExecution();
          public ServiceResponse GetById(int id)       => GetByIdExecution(id);
          public ServiceResponse Update(int id, GalleryUpdateDto dto) => UpdateExecution(id, dto);
          public ServiceResponse Delete(int id, string webRootPath)   => DeleteExecution(id, webRootPath);
          public ServiceResponse TogglePublished(int id)              => TogglePublishedExecution(id);
     }
}
