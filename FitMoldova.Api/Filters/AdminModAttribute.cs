using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FitMoldova.Api.Filters
{
    /// <summary>
    /// ActionFilterAttribute care restricționează accesul doar utilizatorilor cu rolul Admin.
    /// Se aplică înaintea execuției acțiunii controlerului (OnActionExecuting).
    /// Verifică claim-ul "role" din JWT-ul atașat requestului.
    /// </summary>
    public class AdminModAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;

            // 1. Verifică dacă utilizatorul este autentificat
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                Console.WriteLine("[AdminMod] Acces respins: utilizator neautentificat.");
                context.Result = new UnauthorizedObjectResult(new
                {
                    isSuccess = false,
                    message = "Trebuie să fii autentificat pentru a accesa această resursă."
                });
                return;
            }

            // 2. Verifică dacă utilizatorul are rolul Admin
            var roleClaim = user.Claims
                .FirstOrDefault(c => c.Type == "role" || c.Type.EndsWith("/role"))?.Value;

            Console.WriteLine($"[AdminMod] Utilizator: {user.Identity.Name}, Rol detectat: {roleClaim}");

            if (roleClaim != "Admin")
            {
                Console.WriteLine("[AdminMod] Acces respins: rolul nu este Admin.");
                context.Result = new ObjectResult(new
                {
                    isSuccess = false,
                    message = "Acces interzis. Această acțiune necesită privilegii de administrator."
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }

            Console.WriteLine("[AdminMod] Acces permis pentru Admin.");

            // 3. Continuă execuția normală
            base.OnActionExecuting(context);
        }
    }
}
