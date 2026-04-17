using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Club;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class ClubLogic : ClubAction, IClubLogic
     {
          public ServiceResponse GetAll()                              => GetAllExecution();
          public ServiceResponse GetById(int id)                       => GetByIdExecution(id);
          public ServiceResponse CreateClub(ClubCreateDto dto)         => CreateClubExecution(dto);
          public ServiceResponse UpdateClub(int id, ClubUpdateDto dto) => UpdateClubExecution(id, dto);
          public ServiceResponse JoinClub(int cId, int uId)            => JoinClubExecution(cId, uId);
          public ServiceResponse LeaveClub(int cId, int uId)           => LeaveClubExecution(cId, uId);
          public ServiceResponse GetMembers(int clubId)                => GetMembersExecution(clubId);
          public ServiceResponse GetUserClubs(int userId)              => GetUserClubsExecution(userId);
          public ServiceResponse Delete(int id)                        => DeleteExecution(id);
     }
}