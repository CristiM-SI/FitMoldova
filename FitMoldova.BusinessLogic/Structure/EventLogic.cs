using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Event;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class EventLogic : EventAction, IEventLogic
     {
          public ServiceResponse GetAll() => GetAllExecution();
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse CreateEvent(EventCreateDto dto) => CreateEventExecution(dto);
          public ServiceResponse UpdateEvent(int id, EventCreateDto dto) => UpdateEventExecution(id, dto);
          public ServiceResponse JoinEvent(int eId, int uId) => JoinEventExecution(eId, uId);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
     }
}