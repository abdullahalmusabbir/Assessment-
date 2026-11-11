using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class UpdateCircularRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public Guid AcademicYearId { get; set; }

    public DateTime ApplicationStartDate { get; set; }

    public DateTime ApplicationEndDate { get; set; }

    public DateTime PaymentDeadline { get; set; }

    public string? AttachmentUrl { get; set; }
}