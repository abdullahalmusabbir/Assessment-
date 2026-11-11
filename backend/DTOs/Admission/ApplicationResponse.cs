namespace backend.DTOs.Admission;

public class ApplicationResponse
{
    public Guid StudentId { get; set; }

    public string RegistrationNumber { get; set; } = string.Empty;

    public Guid AdmissionHoldId { get; set; }   // <-- ADD THIS

    public string StudentName { get; set; } = string.Empty;

    public string ClassName { get; set; } = string.Empty;

    public string CircularTitle { get; set; } = string.Empty;

    public string PaymentStatus { get; set; } = string.Empty;

    public string HoldStatus { get; set; } = string.Empty;

    public DateTime HoldExpiresAt { get; set; }

    public decimal AdmissionFee { get; set; }

    public string Message { get; set; } = string.Empty;
}