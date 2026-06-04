using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace FitMoldova.BusinessLogic.Core
{
    public interface IEmailService
    {
        void SendPasswordResetCode(string toEmail, string code);
    }

    // Trimite email prin SMTP citind secțiunea "Smtp" din configurare.
    public class EmailService : IEmailService
    {
        private readonly string _host;
        private readonly int _port;
        private readonly string _user;
        private readonly string _password;
        private readonly string _from;

        public EmailService(IConfiguration configuration)
        {
            var smtp = configuration.GetSection("Smtp");
            _host     = smtp["Host"] ?? string.Empty;
            _port     = int.TryParse(smtp["Port"], out var p) ? p : 587;
            _user     = smtp["User"] ?? string.Empty;
            _password = smtp["Password"] ?? string.Empty;
            _from     = smtp["From"] ?? _user;
        }

        public void SendPasswordResetCode(string toEmail, string code)
        {
            using var client = new SmtpClient(_host, _port)
            {
                EnableSsl   = true,
                Credentials = new NetworkCredential(_user, _password)
            };

            using var message = new MailMessage(_from, toEmail)
            {
                Subject = "Cod de resetare a parolei FitMoldova",
                Body =
                    $"Codul tău de resetare a parolei este: {code}\n\n" +
                    "Codul expiră în 15 minute. Dacă nu ai solicitat resetarea parolei, ignoră acest mesaj.",
                IsBodyHtml = false
            };

            client.Send(message);
        }
    }
}
