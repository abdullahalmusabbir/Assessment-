using backend.Enums;
using backend.Models.Common;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Identity;

public class User : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? LastName { get; set; }

    [Required]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public UserStatus Status { get; set; } = UserStatus.Pending;

    public bool EmailVerified { get; set; }

    public DateTime? EmailVerifiedAt { get; set; }

    public bool PhoneVerified { get; set; }

    public DateTime? PhoneVerifiedAt { get; set; }

    public bool IsGoogleAccount { get; set; }

    [MaxLength(500)]
    public string? ProfileImageUrl { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public int FailedLoginAttempts { get; set; }

    public DateTime? LockoutEnd { get; set; }

    public bool TwoFactorEnabled { get; set; }

    public string? TwoFactorSecret { get; set; }

    public DateTime? PasswordChangedAt { get; set; }

    public string? Address { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(100)]
    public string? Country { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public bool MustChangePassword { get; set; }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }

    // Navigation Properties

    public StudentProfile? StudentProfile { get; set; }

    public AdmissionOfficeProfile? AdmissionOfficeProfile { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; }
        = new List<RefreshToken>();

    public ICollection<PasswordResetToken> PasswordResetTokens { get; set; }
        = new List<PasswordResetToken>();
}