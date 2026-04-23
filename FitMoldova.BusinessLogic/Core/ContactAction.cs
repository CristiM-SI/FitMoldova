using FitMoldova.DataAccesLayer;
using FitMoldova.Domain.Entities.Contact;
using FitMoldova.Domain.Models.Contact;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Core
{
     public class ContactAction
     {
          private readonly DbSession _dbSession = new DbSession();

          ///Salvează un mesaj nou de contact trimis din formular.
          public ServiceResponse SubmitExecution(ContactMessageCreateDto dto)
          {
               if (string.IsNullOrWhiteSpace(dto.Name))
                    return new ServiceResponse { isSuccess = false, Message = "Numele este obligatoriu." };
               if (string.IsNullOrWhiteSpace(dto.Email))
                    return new ServiceResponse { isSuccess = false, Message = "Emailul este obligatoriu." };
               if (string.IsNullOrWhiteSpace(dto.Message) || dto.Message.Trim().Length < 20)
                    return new ServiceResponse { isSuccess = false, Message = "Mesajul trebuie să aibă cel puțin 20 de caractere." };

               using var ctx = _dbSession.FitMoldovaContext();
               var entity = new ContactMessageEntity
               {
                    Name      = dto.Name.Trim(),
                    Email     = dto.Email.Trim().ToLower(),
                    Subject   = dto.Subject.Trim(),
                    Message   = dto.Message.Trim(),
                    CreatedAt = DateTime.UtcNow,
                    IsRead    = false,
                    Status    = "new"
               };
               ctx.ContactMessages.Add(entity);
               ctx.SaveChanges();
               return new ServiceResponse
               {
                    isSuccess = true,
                    Message   = "Mesajul tău a fost trimis. Te vom contacta în curând.",
                    Data      = entity.Id
               };
          }

          /// Returnează toate mesajele de contact, cele necitite primele.
          public ServiceResponse GetAllExecution()
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var messages = ctx.ContactMessages
                    .OrderBy(m => m.IsRead)
                    .ThenByDescending(m => m.CreatedAt)
                    .Select(m => new ContactMessageInfoDto
                    {
                         Id        = m.Id,
                         Name      = m.Name,
                         Email     = m.Email,
                         Subject   = m.Subject,
                         Message   = m.Message,
                         CreatedAt = m.CreatedAt,
                         IsRead    = m.IsRead,
                         Status    = m.Status
                    })
                    .ToList();
               return new ServiceResponse { isSuccess = true, Data = messages };
          }

          /// Marchează un mesaj ca citit de admin.
          public ServiceResponse MarkAsReadExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = ctx.ContactMessages.FirstOrDefault(m => m.Id == id);
               if (entity == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Mesajul cu ID {id} nu există." };
               entity.IsRead = true;
               if (entity.Status == "new") entity.Status = "in-progress";
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Mesaj marcat ca citit." };
          }

          /// Șterge definitiv un mesaj de contact.
          public ServiceResponse DeleteExecution(int id)
          {
               using var ctx = _dbSession.FitMoldovaContext();
               var entity = ctx.ContactMessages.FirstOrDefault(m => m.Id == id);
               if (entity == null)
                    return new ServiceResponse { isSuccess = false, Message = $"Mesajul cu ID {id} nu există." };
               ctx.ContactMessages.Remove(entity);
               ctx.SaveChanges();
               return new ServiceResponse { isSuccess = true, Message = "Mesaj șters." };
          }
     }
}
