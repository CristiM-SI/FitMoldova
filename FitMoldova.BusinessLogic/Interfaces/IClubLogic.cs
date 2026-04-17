using FitMoldova.Domain.Models.Club;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IClubLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetById(int id);
          ServiceResponse CreateClub(ClubCreateDto dto);
          ServiceResponse UpdateClub(int id, ClubUpdateDto dto);
          ServiceResponse JoinClub(int clubId, int userId);
          ServiceResponse LeaveClub(int clubId, int userId);
          ServiceResponse GetMembers(int clubId);
          ServiceResponse GetUserClubs(int userId);
          ServiceResponse Delete(int id);
     }
}