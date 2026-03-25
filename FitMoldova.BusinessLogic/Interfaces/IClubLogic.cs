using FitMoldova.Domain.Models.Club;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IClubLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetById(int id);
          ServiceResponse CreateClub(ClubCreateDto dto);
          ServiceResponse JoinClub(int clubId, int userId);
          ServiceResponse Delete(int id);
     }
}