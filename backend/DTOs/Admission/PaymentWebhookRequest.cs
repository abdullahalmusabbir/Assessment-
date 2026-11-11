using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class PaymentWebhookRequest
{
    [Required]
    public string TransactionId { get; set; } = string.Empty;

    [Required]
    public string GatewayReference { get; set; } = string.Empty;

    public string? GatewayResponse { get; set; }
}