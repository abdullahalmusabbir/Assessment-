
namespace backend.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(
        string email,
        string firstName,
        string resetLink
    );
}
