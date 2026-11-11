using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class ApplyAdmissionRequest
{
    [Required]
    public Guid AdmissionCircularId { get; set; }

    [Required]
    public Guid ClassShiftId { get; set; }
}