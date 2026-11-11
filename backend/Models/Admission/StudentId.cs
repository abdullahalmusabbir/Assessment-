using backend.Models.Common;
using backend.Models.Identity;
using backend.Models.Academic;

namespace backend.Models.Admission;

public class StudentId : BaseEntity
{
    public string RegistrationNumber { get; set; } = string.Empty;

    public Guid UserId { get; set; }

    public Guid ClassShiftId { get; set; }

    public Guid AdmissionCircularId { get; set; }

    public bool IsPaymentCompleted { get; set; }

    public bool IsLotteryEligible { get; set; }

    public bool IsSelectedInLottery { get; set; }

    public DateTime? LotteryDate { get; set; }

    public DateTime? AdmissionConfirmedAt { get; set; }

    public User User { get; set; } = null!;

    public ClassShift ClassShift { get; set; } = null!;

    public AdmissionCircular AdmissionCircular { get; set; } = null!;

    public AdmissionHold? AdmissionHold { get; set; }

    public ICollection<Payment> Payments { get; set; }
        = new List<Payment>();
}