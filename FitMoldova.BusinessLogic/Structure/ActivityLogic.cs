using AutoMapper;
using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class ActivityLogic : ActivityAction, IActivityLogic
     {
          public ActivityLogic(IMapper mapper) : base(mapper) { }

          public ServiceResponse GetAll()                                      => GetAllExecution();
          public ServiceResponse GetById(int id)                               => GetByIdExecution(id);
          public ServiceResponse CreateActivity(ActivityCreateDto dto)         => CreateActivityExecution(dto);
          public ServiceResponse UpdateActivity(int id, ActivityUpdateDto dto) => UpdateActivityExecution(id, dto);
          public ServiceResponse Delete(int id)                                => DeleteExecution(id);
          public ServiceResponse JoinActivity(int activityId, int userId)      => JoinActivityExecution(activityId, userId);
          public ServiceResponse LeaveActivity(int activityId, int userId)     => LeaveActivityExecution(activityId, userId);
          public ServiceResponse GetParticipants(int activityId)               => GetParticipantsExecution(activityId);
          public ServiceResponse GetJoinedByUser(int userId)                   => GetJoinedByUserExecution(userId);
     }
}