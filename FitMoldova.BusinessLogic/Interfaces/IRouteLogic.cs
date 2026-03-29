using FitMoldova.Domain.Models.Route;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Interfaces
{
     public interface IRouteLogic
     {
          ServiceResponse GetAll();
          ServiceResponse GetById(int id);
          ServiceResponse CreateRoute(RouteCreateDto dto);
          ServiceResponse Update(int id, RouteCreateDto dto);
          ServiceResponse Delete(int id);
     }
}