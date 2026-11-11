using backend.Data;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.BackgroundServices;

public class AdmissionHoldExpiryService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AdmissionHoldExpiryService> _logger;

    public AdmissionHoldExpiryService(
        IServiceScopeFactory scopeFactory,
        ILogger<AdmissionHoldExpiryService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        _logger.LogInformation(
            "Admission hold expiry service started."
        );

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpireHoldsAsync(stoppingToken);
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error while processing expired admission holds."
                );
            }

            await Task.Delay(
                TimeSpan.FromSeconds(10),
                stoppingToken
            );
        }
    }

    private async Task ExpireHoldsAsync(
        CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        var now = DateTime.UtcNow;

        // Fetch a limited batch. The row locks below ensure
        // each hold is processed safely inside its transaction.
        var expiredHoldIds = await context.AdmissionHolds
            .AsNoTracking()
            .Where(x =>
                x.Status == AdmissionHoldStatus.HELD &&
                x.ExpiresAt <= now
            )
            .OrderBy(x => x.ExpiresAt)
            .Select(x => x.Id)
            .Take(100)
            .ToListAsync(cancellationToken);

        foreach (var holdId in expiredHoldIds)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await using var transaction =
                await context.Database.BeginTransactionAsync(
                    cancellationToken
                );

            try
            {
                var hold = await context.AdmissionHolds
                    .FromSqlInterpolated($"""
                        SELECT *
                        FROM "AdmissionHolds"
                        WHERE "Id" = {holdId}
                        FOR UPDATE
                        """)
                    .AsTracking()
                    .FirstOrDefaultAsync(cancellationToken);

                if (hold == null ||
                    hold.Status != AdmissionHoldStatus.HELD ||
                    hold.ExpiresAt > DateTime.UtcNow)
                {
                    await transaction.CommitAsync(cancellationToken);
                    continue;
                }

                var student = await context.StudentIds
                    .FirstOrDefaultAsync(
                        x => x.Id == hold.StudentIdId,
                        cancellationToken
                    );

                if (student == null)
                {
                    context.AdmissionHolds.Remove(hold);
                    await context.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    continue;
                }

                // A successful payment must never be deleted.
                if (student.IsPaymentCompleted)
                {
                    hold.Status = AdmissionHoldStatus.CONFIRMED;
                    hold.ConfirmedAt ??= student.AdmissionConfirmedAt
                        ?? DateTime.UtcNow;

                    await context.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    continue;
                }

                // Remove non-successful payment attempts before
                // removing the StudentId they reference.
                var unpaidPayments = await context.Payments
                    .Where(x =>
                        x.StudentIdId == student.Id &&
                        x.Status != PaymentStatus.Successful
                    )
                    .ToListAsync(cancellationToken);

                context.Payments.RemoveRange(unpaidPayments);

                context.AdmissionHolds.Remove(hold);
                context.StudentIds.Remove(student);

                await context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                _logger.LogInformation(
                    "Expired hold {HoldId}; removed unpaid application {StudentId}.",
                    holdId,
                    student.Id
                );
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);

                _logger.LogError(
                    ex,
                    "Failed to expire admission hold {HoldId}.",
                    holdId
                );
            }
        }
    }
}