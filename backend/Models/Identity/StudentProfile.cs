using backend.Models.Common;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Identity;

public class StudentProfile : BaseEntity
{
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(150)]
    public string GuardianName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? GuardianPhone { get; set; }

    [MaxLength(200)]
    public string? GuardianEmail { get; set; }

    [MaxLength(100)]
    public string? FatherName { get; set; }

    [MaxLength(100)]
    public string? MotherName { get; set; }

    [MaxLength(30)]
    public string? BirthRegistrationNumber { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(20)]
    public string? Gender { get; set; }

    public string? PresentAddress { get; set; }

    public string? PermanentAddress { get; set; }

    [MaxLength(150)]
    public string? PreviousSchool { get; set; }

    [MaxLength(100)]
    public string? PreviousClass { get; set; }

    [MaxLength(50)]
    public string? BloodGroup { get; set; }

    public User? User { get; set; }
}