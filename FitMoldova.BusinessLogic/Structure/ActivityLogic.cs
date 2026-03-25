using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class ActivityLogic : ActivityAction, IActivityLogic
     {
          public ServiceResponse CreateActivity(ActivityCreateDto dto) => CreateActivityExecution(dto);
          public ServiceResponse GetByUser(int userId) => GetByUserExecution(userId);
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
     }
}