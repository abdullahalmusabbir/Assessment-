using backend.Models.Common;

namespace backend.Models.Identity;

public class PasswordResetToken : BaseEntity
{
    public Guid UserId { get; set; }

    public string TokenHash { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime? UsedAt { get; set; }

    public string? RequestIp { get; set; }

    public User? User { get; set; }
}