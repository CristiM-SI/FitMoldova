using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FitMoldova.Api.Filters
{
    /// <summary>
    /// ActionFilterAttribute care restricționează accesul doar utilizatorilor autentificați.
    /// Nu verifică rolul — orice utilizator logat (User sau Admin) poate trece.
    /// Se execută înaintea AdminModAttribute în lanțul de filtre.
    /// </summary>
    public class UserModAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User;

            // Verifică dacă utilizatorul este autentificat
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                Console.WriteLine("[UserMod] Acces respins: utilizator neautentificat.");
                context.Result = new UnauthorizedObjectResult(new
                {
                    isSuccess = false,
                    message = "Trebuie să fii autentificat pentru a efectua această acțiune."
                });
                return;
            }

            var userId = user.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            Console.WriteLine($"[UserMod] Acces permis pentru userId={userId}.");

            base.OnActionExecuting(context);
        }
    }
}
