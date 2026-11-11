using backend.Models.Common;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Identity;

public class AdmissionOfficeProfile : BaseEntity
{
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string EmployeeId { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Department { get; set; }

    [MaxLength(100)]
    public string? Designation { get; set; }

    public DateTime JoiningDate { get; set; }

    public bool CanCreateAdmin { get; set; }

    public bool CanManageCirculars { get; set; }

    public bool CanManageAdmissions { get; set; }

    public bool IsApproved { get; set; }

    public User? User { get; set; }
}