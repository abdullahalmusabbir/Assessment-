using backend.Enums;

namespace backend.DTOs.Admin;

public class AdminUserResponse
{
    public Guid Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string Role { get; set; } = string.Empty;

    public UserStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? EmployeeId { get; set; }
}