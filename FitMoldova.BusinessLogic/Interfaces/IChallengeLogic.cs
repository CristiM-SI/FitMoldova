using FitMoldova.Domain.Models.Challenge;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IChallengeLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetById(int id);
          ServiceResponse CreateChallenge(ChallengeCreateDto dto);
          ServiceResponse UpdateChallenge(int id, ChallengeUpdateDto dto);
          ServiceResponse JoinChallenge(int challengeId, int userId);
          ServiceResponse Delete(int id);
     }
}