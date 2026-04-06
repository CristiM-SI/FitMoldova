using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Challenge;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class ChallengeLogic : ChallengeAction, IChallengeLogic
     {
          public ServiceResponse GetAll()                                         => GetAllExecution();
          public ServiceResponse GetById(int id)                                  => GetByIdExecution(id);
          public ServiceResponse CreateChallenge(ChallengeCreateDto dto)          => CreateChallengeExecution(dto);
          public ServiceResponse UpdateChallenge(int id, ChallengeUpdateDto dto)  => UpdateChallengeExecution(id, dto);
          public ServiceResponse JoinChallenge(int cId, int uId)                  => JoinChallengeExecution(cId, uId);
          public ServiceResponse Delete(int id)                                   => DeleteExecution(id);
     }
}