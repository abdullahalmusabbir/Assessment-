using backend.Models.Common;
using backend.Models.Academic;
using backend.Enums;

namespace backend.Models.Admission;

public class AdmissionHold : BaseEntity
{
    public Guid StudentIdId { get; set; }

    public Guid ClassShiftId { get; set; }

    public Guid AdmissionCircularId { get; set; }

    public AdmissionHoldStatus Status { get; set; }
        = AdmissionHoldStatus.HELD;

    public DateTime HeldAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? ConfirmedAt { get; set; }

    public DateTime? CancelledAt { get; set; }

    public DateTime? ExpiredAt { get; set; }

    public StudentId StudentId { get; set; } = null!;

    public ClassShift ClassShift { get; set; } = null!;

    public AdmissionCircular AdmissionCircular { get; set; } = null!;
}