using FitMoldova.Domain.Models.Activity;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IActivityLogic
     {
          ServiceResponse GetAll();                                  // pagina principală — toți userii
          ServiceResponse GetById(int id);                           // detalii activitate
          ServiceResponse CreateActivity(ActivityCreateDto dto);     // doar admin
          ServiceResponse Delete(int id);                            // doar admin
          ServiceResponse JoinActivity(int activityId, int userId);  // orice user
          ServiceResponse GetParticipants(int activityId);           // lista participanților
     }
}