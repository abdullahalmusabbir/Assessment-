using backend.Data;
using backend.DTOs.Admission;
using backend.Enums;
using backend.Interfaces;
using backend.Models.Admission;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;

    public PaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================
    // CREATE PAYMENT
    // =========================================

    public async Task<PaymentResponse> CreatePaymentAsync(
        Guid userId,
        CreatePaymentRequest request)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable
            );

        var hold = await _context.AdmissionHolds
            .FromSqlInterpolated($"""
                SELECT *
                FROM "AdmissionHolds"
                WHERE "Id" = {request.AdmissionHoldId}
                FOR UPDATE
                """)
            .AsTracking()
            .FirstOrDefaultAsync();

        if (hold == null)
            throw new KeyNotFoundException("Admission hold not found.");

        var student = await _context.StudentIds
            .FirstOrDefaultAsync(x => x.Id == hold.StudentIdId);

        if (student == null || student.UserId != userId)
            throw new UnauthorizedAccessException(
                "You cannot pay for another student's application."
            );

        if (hold.Status == AdmissionHoldStatus.CONFIRMED &&
            student.IsPaymentCompleted)
        {
            throw new InvalidOperationException(
                "Payment has already been completed."
            );
        }

        if (hold.Status != AdmissionHoldStatus.HELD ||
            hold.ExpiresAt <= DateTime.UtcNow)
        {
            throw new InvalidOperationException(
                "Admission hold has expired."
            );
        }

        var existingPayment = await _context.Payments
            .FirstOrDefaultAsync(x =>
                x.IdempotencyKey == request.IdempotencyKey
            );

        if (existingPayment != null)
        {
            if (existingPayment.StudentIdId != student.Id)
                throw new InvalidOperationException(
                    "Idempotency key is already in use."
                );

            await transaction.CommitAsync();

            return MapPayment(existingPayment, hold.ExpiresAt);
        }

        var circular = await _context.AdmissionCirculars
            .FirstAsync(x => x.Id == student.AdmissionCircularId);

        if (DateTime.UtcNow > circular.PaymentDeadline)
            throw new InvalidOperationException(
                "Payment deadline has passed."
            );

        var shift = await _context.ClassShifts
            .FirstAsync(x => x.Id == student.ClassShiftId);

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            StudentIdId = student.Id,
            AdmissionHoldId = hold.Id,
            TransactionId = $"SCHPAY-{Guid.NewGuid():N}",
            PaymentMethod = request.PaymentMethod.Trim(),
            Amount = shift.AdmissionFee,
            Currency = "BDT",
            Status = PaymentStatus.Pending,
            IdempotencyKey = request.IdempotencyKey.Trim()
        };

        _context.Payments.Add(payment);

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return MapPayment(payment, hold.ExpiresAt);
    }

    // =========================================
    // CONFIRM PAYMENT
    // =========================================

    public async Task ConfirmPaymentAsync(
        string transactionId,
        string gatewayReference,
        string? gatewayResponse)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable
            );

        var payment = await _context.Payments
            .FromSqlInterpolated($"""
                SELECT *
                FROM "Payments"
                WHERE "TransactionId" = {transactionId}
                FOR UPDATE
                """)
            .AsTracking()
            .FirstOrDefaultAsync();

        if (payment == null)
            throw new KeyNotFoundException("Payment not found.");

        // Idempotent callback: repeated success notifications
        // must not change the result or count the seat again.
        if (payment.Status == PaymentStatus.Successful)
        {
            await transaction.CommitAsync();
            return;
        }

        if (payment.Status != PaymentStatus.Pending &&
            payment.Status != PaymentStatus.Processing)
        {
            throw new InvalidOperationException(
                "Payment cannot be confirmed in its current state."
            );
        }

        var hold = await _context.AdmissionHolds
            .FromSqlInterpolated($"""
                SELECT *
                FROM "AdmissionHolds"
                WHERE "Id" = {payment.AdmissionHoldId}
                FOR UPDATE
                """)
            .AsTracking()
            .FirstOrDefaultAsync();

        if (hold == null)
            throw new InvalidOperationException(
                "Admission hold no longer exists."
            );

        var student = await _context.StudentIds
            .FirstOrDefaultAsync(x => x.Id == payment.StudentIdId);

        if (student == null)
            throw new InvalidOperationException(
                "Student application no longer exists."
            );

        if (hold.Status != AdmissionHoldStatus.HELD ||
            hold.ExpiresAt <= DateTime.UtcNow)
        {
            throw new InvalidOperationException(
                "The admission hold has expired. Payment cannot be confirmed."
            );
        }

        // Lock the shift before checking occupied seats.
        var shift = await _context.ClassShifts
            .FromSqlInterpolated($"""
                SELECT *
                FROM "ClassShifts"
                WHERE "Id" = {hold.ClassShiftId}
                FOR UPDATE
                """)
            .AsTracking()
            .FirstOrDefaultAsync();

        if (shift == null)
            throw new InvalidOperationException("Class shift not found.");

        // A successful payment must not exceed seat capacity.
        var occupiedSeats = await _context.AdmissionHolds
            .CountAsync(x =>
                x.ClassShiftId == shift.Id &&
                (
                    x.Status == AdmissionHoldStatus.CONFIRMED ||
                    (
                        x.Status == AdmissionHoldStatus.HELD &&
                        x.ExpiresAt > DateTime.UtcNow
                    )
                )
            );

        if (occupiedSeats > shift.TotalSeats)
            throw new InvalidOperationException(
                "Seat capacity validation failed."
            );

        payment.Status = PaymentStatus.Successful;
        payment.PaidAt = DateTime.UtcNow;
        payment.GatewayReference = gatewayReference;
        payment.GatewayResponse = gatewayResponse;

        hold.Status = AdmissionHoldStatus.CONFIRMED;
        hold.ConfirmedAt = DateTime.UtcNow;

        student.IsPaymentCompleted = true;
        student.IsLotteryEligible = true;
        student.AdmissionConfirmedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();
    }

    // =========================================
    // GET PAYMENT
    // =========================================

    public async Task<PaymentResponse?> GetPaymentAsync(
        Guid userId,
        Guid paymentId)
    {
        var payment = await _context.Payments
            .AsNoTracking()
            .Include(x => x.StudentId)
            .Include(x => x.AdmissionHold)
            .FirstOrDefaultAsync(x =>
                x.Id == paymentId &&
                x.StudentId.UserId == userId
            );

        if (payment == null)
            return null;

        return MapPayment(
            payment,
            payment.AdmissionHold.ExpiresAt
        );
    }

    // =========================================
    // MAPPING
    // =========================================

    private static PaymentResponse MapPayment(
        Payment payment,
        DateTime? holdExpiresAt)
    {
        return new PaymentResponse
        {
            PaymentId = payment.Id,
            TransactionId = payment.TransactionId,
            Amount = payment.Amount,
            Currency = payment.Currency,
            Status = payment.Status.ToString(),
            HoldExpiresAt = holdExpiresAt,
            PaymentUrl = null,
            Message = payment.Status == PaymentStatus.Successful
                ? "Payment completed."
                : "Payment record created. Connect a payment gateway to complete checkout."
        };
    }
}