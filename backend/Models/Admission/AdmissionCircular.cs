using backend.Models.Common;
using backend.Models.Academic;

namespace backend.Models.Admission;

public class AdmissionCircular : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Guid AcademicYearId { get; set; }

    public DateTime ApplicationStartDate { get; set; }

    public DateTime ApplicationEndDate { get; set; }

    public DateTime PaymentDeadline { get; set; }

    public bool IsPublished { get; set; }

    public bool IsActive { get; set; } = true;

    public string? AttachmentUrl { get; set; }

    public Guid CreatedByUserId { get; set; }

    public AcademicYear AcademicYear { get; set; } = null!;

    public ICollection<StudentId> StudentIds { get; set; }
        = new List<StudentId>();

    public ICollection<AdmissionHold> AdmissionHolds { get; set; }
        = new List<AdmissionHold>();
}