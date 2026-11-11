using backend.Models.Common;

namespace backend.Models.Identity;

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }

    public string TokenHash { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public string? ReplacedByTokenHash { get; set; }

    public string? CreatedByIp { get; set; }

    public string? RevokedByIp { get; set; }

    public string? DeviceName { get; set; }

    public bool IsRevoked => RevokedAt.HasValue;

    public User? User { get; set; }
}