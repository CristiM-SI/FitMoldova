using FitMoldova.Domain.Models.Event;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IEventLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetById(int id);
          ServiceResponse CreateEvent(EventCreateDto dto);
          ServiceResponse UpdateEvent(int id, EventCreateDto dto);
          ServiceResponse JoinEvent(int eventId, int userId);
          ServiceResponse Delete(int id);
          ServiceResponse LeaveEvent(int eventId, int userId);
          ServiceResponse IsParticipant(int eventId, int userId); 
     }
}
