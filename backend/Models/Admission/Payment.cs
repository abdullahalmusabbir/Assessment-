using backend.Models.Common;
using backend.Enums;

namespace backend.Models.Admission;

public class Payment : BaseEntity
{
    public Guid StudentIdId { get; set; }

    public Guid AdmissionHoldId { get; set; }

    public string? TransactionId { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "BDT";

    public PaymentStatus Status { get; set; }
        = PaymentStatus.Pending;

    public DateTime? PaidAt { get; set; }

    public DateTime? FailedAt { get; set; }

    public string? GatewayReference { get; set; }

    public string? GatewayResponse { get; set; }

    public string? FailureReason { get; set; }

    public string IdempotencyKey { get; set; } = string.Empty;

    public StudentId StudentId { get; set; } = null!;

    public AdmissionHold AdmissionHold { get; set; } = null!;
}