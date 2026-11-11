using backend.DTOs.Admission;

namespace backend.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponse> CreatePaymentAsync(
        Guid userId,
        CreatePaymentRequest request
    );

    Task ConfirmPaymentAsync(
        string transactionId,
        string gatewayReference,
        string? gatewayResponse
    );

    Task<PaymentResponse?> GetPaymentAsync(
        Guid userId,
        Guid paymentId
    );
}