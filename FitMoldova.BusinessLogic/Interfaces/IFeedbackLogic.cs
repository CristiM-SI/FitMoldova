using FitMoldova.Domain.Models.Feedback;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
    public interface IFeedbackLogic
    {
        ServiceResponse Submit(FeedbackCreateDto dto);
        ServiceResponse GetAll();
        ServiceResponse GetAllAdmin();
        ServiceResponse GetStats();
        ServiceResponse UpdateStatus(int id, string status);
        ServiceResponse TogglePin(int id);
        ServiceResponse Delete(int id);
    }
}
