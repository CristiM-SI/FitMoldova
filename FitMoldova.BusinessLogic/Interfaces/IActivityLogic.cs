using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IActivityLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetById(int id);
          ServiceResponse CreateActivity(ActivityCreateDto dto);
          ServiceResponse UpdateActivity(int id, ActivityUpdateDto dto);
          ServiceResponse Delete(int id);
          ServiceResponse JoinActivity(int activityId, int userId);
          ServiceResponse LeaveActivity(int activityId, int userId);
          ServiceResponse GetParticipants(int activityId);
          ServiceResponse GetJoinedByUser(int userId);
     }
}