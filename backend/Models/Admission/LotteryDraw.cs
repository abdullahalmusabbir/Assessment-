using backend.Models.Common;
using backend.Models.Academic;

namespace backend.Models.Admission;

public class LotteryDraw : BaseEntity
{
    public Guid AdmissionCircularId { get; set; }

    public Guid ClassShiftId { get; set; }

    public DateTime DrawDate { get; set; }

    public bool IsPublished { get; set; }

    public Guid DrawnByUserId { get; set; }

    public int TotalEligibleStudents { get; set; }

    public int TotalSelectedStudents { get; set; }

    public AdmissionCircular AdmissionCircular { get; set; }
        = null!;

    public ClassShift ClassShift { get; set; } = null!;

    public ICollection<LotteryResult> Results { get; set; }
        = new List<LotteryResult>();
}