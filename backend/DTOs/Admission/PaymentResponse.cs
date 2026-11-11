namespace backend.DTOs.Admission;

public class PaymentResponse
{
    public Guid PaymentId { get; set; }

    public string? TransactionId { get; set; }

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "BDT";

    public string Status { get; set; } = string.Empty;

    public string? PaymentUrl { get; set; }

    public DateTime? HoldExpiresAt { get; set; }

    public string Message { get; set; } = string.Empty;
}