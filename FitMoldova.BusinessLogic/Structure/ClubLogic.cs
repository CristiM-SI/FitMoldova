using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Club;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class ClubLogic : ClubAction, IClubLogic
     {
          public ServiceResponse GetAll() => GetAllExecution();
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse CreateClub(ClubCreateDto dto) => CreateClubExecution(dto);
          public ServiceResponse JoinClub(int cId, int uId) => JoinClubExecution(cId, uId);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
     }
}