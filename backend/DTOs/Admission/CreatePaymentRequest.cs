using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class CreatePaymentRequest
{
    [Required]
    public Guid AdmissionHoldId { get; set; }

    [Required]
    [StringLength(50)]
    public string PaymentMethod { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string IdempotencyKey { get; set; } = string.Empty;
}