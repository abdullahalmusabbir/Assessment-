using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admin;

public class CreateAdmissionOfficeRequest
{
    [Required, StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }

    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required, StringLength(50)]
    public string EmployeeId { get; set; } = string.Empty;

    [StringLength(100)]
    public string? Department { get; set; }

    [StringLength(100)]
    public string? Designation { get; set; }

    public bool CanCreateAdmin { get; set; } = false;

    public bool CanManageCirculars { get; set; } = true;

    public bool CanManageAdmissions { get; set; } = true;
}