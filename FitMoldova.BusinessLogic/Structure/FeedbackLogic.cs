using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Feedback;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
    public class FeedbackLogic : FeedbackAction, IFeedbackLogic
    {
        public ServiceResponse Submit(FeedbackCreateDto dto)      => SubmitExecution(dto);
        public ServiceResponse GetAll()                            => GetAllExecution();
        public ServiceResponse GetAllAdmin()                       => GetAllAdminExecution();
        public ServiceResponse GetStats()                          => GetStatsExecution();
        public ServiceResponse UpdateStatus(int id, string status) => UpdateStatusExecution(id, status);
        public ServiceResponse TogglePin(int id)                   => TogglePinExecution(id);
        public ServiceResponse Delete(int id)                      => DeleteExecution(id);
    }
}
