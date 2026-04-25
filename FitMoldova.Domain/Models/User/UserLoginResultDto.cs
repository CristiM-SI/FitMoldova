namespace FitMoldova.Domain.Models.User
{
    /// <summary>
    /// DTO tipat returnat de IUserLogic.Login() — elimina reflexia din UserController.
    /// CRITICA 3 FIX: inlocuieste object anonim cu tip concret.
    /// </summary>
    public class UserLoginResultDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string RegisteredAt { get; set; } = string.Empty;
    }
}
