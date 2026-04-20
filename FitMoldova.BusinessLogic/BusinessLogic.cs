using AutoMapper;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.BusinessLogic.Structure;

namespace FitMoldova.BusinessLogic
{
     /// <summary>
     /// Aggregator / factory pentru toate componentele business.
     /// Primește IMapper prin DI și îl pasează mai departe claselor Logic
     /// La moment:ActivityLogic și ClubLogic.
     /// </summary>
     public class BusinessLogic
     {
          private readonly IMapper _mapper;

          public BusinessLogic(IMapper mapper)
          {
               _mapper = mapper;
          }
          
          public IActivityLogic ActivityLogic() => new ActivityLogic(_mapper);
          public IRouteLogic RouteLogic() => new RouteLogic();
          public IEventLogic EventLogic() => new EventLogic();
          public IClubLogic ClubLogic() => new ClubLogic(_mapper);
          public IChallengeLogic ChallengeLogic() => new ChallengeLogic();
          public IPostLogic PostLogic() => new PostLogic();
     }
}