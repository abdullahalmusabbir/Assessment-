using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using backend.Interfaces;

namespace backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendPasswordResetEmailAsync(
        string email,
        string firstName,
        string resetLink
    )
    {
        var settings = _configuration.GetSection("Email");

        var host = settings["Host"]
            ?? throw new InvalidOperationException("Email host is missing.");

        var port = settings.GetValue<int>("Port");

        var username = settings["Username"]
            ?? throw new InvalidOperationException("Email username is missing.");

        var password = settings["Password"]
            ?? throw new InvalidOperationException("Email password is missing.");

        var fromEmail = settings["FromEmail"]
            ?? throw new InvalidOperationException("FromEmail is missing.");

        var fromName = settings["FromName"] ?? "School Admission System";

        var message = new MimeMessage();

        message.From.Add(new MailboxAddress(fromName, fromEmail));

        message.To.Add(MailboxAddress.Parse(email));

        message.Subject = "Reset Your Password";

        message.Body = new BodyBuilder
        {
            HtmlBody = $"""
                <h2>Password Reset Request</h2>

                <p>Hello {System.Net.WebUtility.HtmlEncode(firstName)},</p>

                <p>We received a request to reset your password.</p>

                <p>
                    <a href="{System.Net.WebUtility.HtmlEncode(resetLink)}">
                        Reset Password
                    </a>
                </p>

                <p>This link will expire in 15 minutes.</p>

                <p>If you did not request this, you can ignore this email.</p>
            """
        }.ToMessageBody();

        using var client = new SmtpClient();

        await client.ConnectAsync(
            host,
            port,
            SecureSocketOptions.StartTls
        );

        await client.AuthenticateAsync(username, password);

        client.Send(message);

        await client.DisconnectAsync(true);
    }
}