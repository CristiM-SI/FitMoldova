using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IActivityLogic
     {
          ServiceResponse CreateActivity(ActivityCreateDto dto);
          ServiceResponse GetByUser(int userId);
          ServiceResponse GetById(int id);
          ServiceResponse Delete(int id);
     }
}