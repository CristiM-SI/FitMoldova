using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.BusinessLogic.Structure;

namespace FitMoldova.BusinessLogic
{
     public class BusinessLogic
     {
          public BusinessLogic() { }

          public IUserLogic UserLogic() => new UserLogic();
          public IActivityLogic ActivityLogic() => new ActivityLogic();
          public IRouteLogic RouteLogic() => new RouteLogic();
          public IEventLogic EventLogic() => new EventLogic();
          public IClubLogic ClubLogic() => new ClubLogic();
          public IChallengeLogic ChallengeLogic() => new ChallengeLogic();
          public IPostLogic PostLogic() => new PostLogic();
     }
}
