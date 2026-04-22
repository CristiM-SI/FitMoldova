  using AutoMapper;
  using FitMoldova.DataAccesLayer;
  using FitMoldova.Domain.Entities.Route;
  using FitMoldova.Domain.Models.Route;
  using FitMoldova.Domain.Models.Services;
  using Microsoft.EntityFrameworkCore;

  namespace FitMoldova.BusinessLogic.Core
  {
      public class RouteAction
      {
          private readonly DbSession _dbSession = new DbSession();

          public ServiceResponse GetAllExecution()
          {
              using var ctx = _dbSession.FitMoldovaContext();
              var list = ctx.Routes
                  .Include(r => r.Highlights)
                  .Include(r => r.Path)
                  .OrderBy(r => r.Name)
                  .Select(r => new RouteInfoDto
                  {
                      Id = r.Id,
                      Name = r.Name,
                      Type = r.Type,
                      Difficulty = r.Difficulty,
                      Distance = r.Distance,
                      EstimatedDuration = r.EstimatedDuration,
                      ElevationGain = r.ElevationGain,
                      Description = r.Description,
                      Region = r.Region,
                      Surface = r.Surface,
                      IsLoop = r.IsLoop,
                      Icon = r.Icon,
                      BestSeason = r.BestSeason,
                      StartLat = r.StartLat,
                      StartLng = r.StartLng,
                      EndLat = r.EndLat,
                      EndLng = r.EndLng,
                      Highlights = r.Highlights.OrderBy(h => h.Order).Select(h => h.Text).ToList(),
                      Path = r.Path.OrderBy(c => c.Order).Select(c => new RouteCoordDto { Lat = c.Lat, Lng = c.Lng }).ToList()
                  })
                  .ToList();
              return new ServiceResponse { isSuccess = true, Data = list };
          }

          public ServiceResponse GetByIdExecution(int id)
          {
              using var ctx = _dbSession.FitMoldovaContext();
              var r = ctx.Routes
                  .Include(r => r.Highlights)
                  .Include(r => r.Path)
                  .FirstOrDefault(r => r.Id == id);
              if (r == null)
                  return new ServiceResponse { isSuccess = false, Message = "Traseul nu a fost găsit." };
              return new ServiceResponse { isSuccess = true, Data = new RouteInfoDto
              {
                  Id = r.Id, Name = r.Name, Type = r.Type, Difficulty = r.Difficulty,
                  Distance = r.Distance, EstimatedDuration = r.EstimatedDuration, ElevationGain = r.ElevationGain,
                  Description = r.Description, Region = r.Region, Surface = r.Surface, IsLoop = r.IsLoop,
                  Icon = r.Icon, BestSeason = r.BestSeason,
                  StartLat = r.StartLat, StartLng = r.StartLng, EndLat = r.EndLat, EndLng = r.EndLng,
                  Highlights = r.Highlights.OrderBy(h => h.Order).Select(h => h.Text).ToList(),
                  Path = r.Path.OrderBy(c => c.Order).Select(c => new RouteCoordDto { Lat = c.Lat, Lng = c.Lng }).ToList()
              }};
          }

          public ServiceResponse CreateRouteExecution(RouteCreateDto dto)
          {
              using var ctx = _dbSession.FitMoldovaContext();
              var route = new RouteEntity
              {
                  Name = dto.Name, Type = dto.Type, Difficulty = dto.Difficulty,
                  Distance = dto.Distance, EstimatedDuration = dto.EstimatedDuration,
                  ElevationGain = dto.ElevationGain, Description = dto.Description,
                  Region = dto.Region, Surface = dto.Surface, IsLoop = dto.IsLoop,
                  Icon = dto.Icon, BestSeason = dto.BestSeason,
                  StartLat = dto.StartLat, StartLng = dto.StartLng,
                  EndLat = dto.EndLat, EndLng = dto.EndLng,
                  Highlights = dto.Highlights.Select((text, i) => new RouteHighlightEntity { Text = text, Order = i }).ToList(),
                  Path = dto.Path.Select((c, i) => new RouteCoordEntity { Lat = c.Lat, Lng = c.Lng, Order = i }).ToList()
              };
              ctx.Routes.Add(route);
              ctx.SaveChanges();
              return new ServiceResponse { isSuccess = true, Message = "Traseu adăugat.", Data = route.Id };
          }

          public ServiceResponse UpdateExecution(int id, RouteCreateDto dto)
          {
              using var ctx = _dbSession.FitMoldovaContext();
              var route = ctx.Routes
                  .Include(r => r.Highlights)
                  .Include(r => r.Path)
                  .FirstOrDefault(r => r.Id == id);
              if (route == null)
                  return new ServiceResponse { isSuccess = false, Message = "Traseul nu a fost găsit." };

              route.Name = dto.Name; route.Type = dto.Type; route.Difficulty = dto.Difficulty;
              route.Distance = dto.Distance; route.EstimatedDuration = dto.EstimatedDuration;
              route.ElevationGain = dto.ElevationGain; route.Description = dto.Description;
              route.Region = dto.Region; route.Surface = dto.Surface; route.IsLoop = dto.IsLoop;
              route.Icon = dto.Icon; route.BestSeason = dto.BestSeason;
              route.StartLat = dto.StartLat; route.StartLng = dto.StartLng;
              route.EndLat = dto.EndLat; route.EndLng = dto.EndLng;

              ctx.RouteHighlights.RemoveRange(route.Highlights);
              ctx.RouteCoords.RemoveRange(route.Path);
              route.Highlights = dto.Highlights.Select((text, i) => new RouteHighlightEntity { Text = text, Order = i, RouteId = id }).ToList();
              route.Path = dto.Path.Select((c, i) => new RouteCoordEntity { Lat = c.Lat, Lng = c.Lng, Order = i, RouteId = id }).ToList();

              ctx.SaveChanges();
              return new ServiceResponse { isSuccess = true, Message = "Traseu actualizat." };
          }

          public ServiceResponse DeleteExecution(int id)
          {
              using var ctx = _dbSession.FitMoldovaContext();
              var route = ctx.Routes.FirstOrDefault(r => r.Id == id);
              if (route == null)
                  return new ServiceResponse { isSuccess = false, Message = "Traseul nu a fost găsit." };
              ctx.Routes.Remove(route);
              ctx.SaveChanges();
              return new ServiceResponse { isSuccess = true, Message = "Traseu șters." };
          }
      }
  }
