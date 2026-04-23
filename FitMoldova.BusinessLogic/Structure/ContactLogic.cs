using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Contact;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class ContactLogic : ContactAction, IContactLogic
     {
          public ServiceResponse Submit(ContactMessageCreateDto dto) => SubmitExecution(dto);
          public ServiceResponse GetAll()                             => GetAllExecution();
          public ServiceResponse MarkAsRead(int id)                  => MarkAsReadExecution(id);
          public ServiceResponse Delete(int id)                      => DeleteExecution(id);
     }
}
