using backend.Models.Common;
using backend.Models.Admission;
using backend.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Payment;

public class Payment : BaseEntity
{
    public Guid StudentIdId { get; set; }

    public Guid AdmissionHoldId { get; set; }

    [Required]
    [MaxLength(100)]
    public string TransactionId { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    [MaxLength(10)]
    public string Currency { get; set; } = "BDT";

    public PaymentStatus Status { get; set; }
        = PaymentStatus.Pending;

    public DateTime? PaidAt { get; set; }

    public DateTime? FailedAt { get; set; }

    public string? GatewayReference { get; set; }

    public string? GatewayResponse { get; set; }

    public string? FailureReason { get; set; }

    public string? IdempotencyKey { get; set; }

    public StudentId? StudentId { get; set; }

    public AdmissionHold? AdmissionHold { get; set; }
}