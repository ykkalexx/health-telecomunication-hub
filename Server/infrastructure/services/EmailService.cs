using SendGrid;
using SendGrid.Helpers.Mail;
using Server.core.interfaces;
using Microsoft.Extensions.Configuration;

namespace Server.infrastructure.services {
    public class EmailService : IEmailService {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration) {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string email, string subject, string message) {
            var client = new SendGridClient(_configuration["SendGrid:ApiKey"]);
            var msg = new SendGridMessage {
                From = new EmailAddress(_configuration["SendGrid:FromEmail"]),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));
            await client.SendEmailAsync(msg);
        }
    }
}
