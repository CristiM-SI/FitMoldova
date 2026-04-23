using FitMoldova.Domain.Models.Contact;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IContactLogic
     {
          ServiceResponse Submit(ContactMessageCreateDto dto);
          ServiceResponse GetAll();
          ServiceResponse MarkAsRead(int id);
          ServiceResponse Delete(int id);
     }
}
