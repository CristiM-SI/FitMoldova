using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.Domain.Models.Route;
using FitMoldova.Domain.Models.Services;

namespace FitMoldova.BusinessLogic.Structure
{
     public class RouteLogic : RouteAction, IRouteLogic
     {
          public ServiceResponse GetAll() => GetAllExecution();
          public ServiceResponse GetById(int id) => GetByIdExecution(id);
          public ServiceResponse CreateRoute(RouteCreateDto dto) => CreateRouteExecution(dto);
          public ServiceResponse Update(int id, RouteCreateDto dto) => UpdateExecution(id, dto);
          public ServiceResponse Delete(int id) => DeleteExecution(id);
     }
}