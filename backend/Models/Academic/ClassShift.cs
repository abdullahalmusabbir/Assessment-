using backend.Models.Common;
using backend.Models.Admission;

namespace backend.Models.Academic;

public class ClassShift : BaseEntity
{
    public Guid SchoolClassId { get; set; }

    public string ShiftName { get; set; } = string.Empty;

    public int TotalSeats { get; set; }

    public int MinimumAge { get; set; }

    public int MaximumAge { get; set; }

    public decimal AdmissionFee { get; set; }

    public bool IsActive { get; set; } = true;

    public string? Description { get; set; }

    public SchoolClass SchoolClass { get; set; } = null!;

    public ICollection<StudentId> StudentIds { get; set; }
        = new List<StudentId>();

    public ICollection<AdmissionHold> AdmissionHolds { get; set; }
        = new List<AdmissionHold>();
}