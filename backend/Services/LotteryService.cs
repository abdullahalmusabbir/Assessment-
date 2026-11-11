using System.Security.Cryptography;
using backend.Data;
using backend.DTOs.Lottery;
using backend.Interfaces;
using backend.Models.Admission;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class LotteryService : ILotteryService
{
    private readonly ApplicationDbContext _context;

    public LotteryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LotteryResultResponse?> GetMyResultAsync(
    Guid userId,
    Guid circularId,
    Guid shiftId)
    {
        var result = await _context.LotteryResults
            .AsNoTracking()
            .Include(x => x.LotteryDraw)
            .Include(x => x.StudentId)
            .FirstOrDefaultAsync(x =>
                x.LotteryDraw.AdmissionCircularId == circularId &&
                x.LotteryDraw.ClassShiftId == shiftId &&
                x.LotteryDraw.IsPublished &&
                x.StudentId.UserId == userId
            );

        if (result == null)
            return null;

        return new LotteryResultResponse
        {
            LotteryDrawId = result.LotteryDrawId,
            StudentId = result.StudentIdId,
            RegistrationNumber = result.StudentId.RegistrationNumber,
            Position = result.Position,
            IsSelected = result.IsSelected,
            DrawDate = result.LotteryDraw.DrawDate,
            Result = result.IsSelected ? "Selected" : "Not Selected"
        };
    }

    public async Task<List<LotteryDrawResponse>> GetLotteryDrawsAsync()
    {
        return await _context.LotteryDraws
            .AsNoTracking()
            .Include(x => x.AdmissionCircular)
            .Include(x => x.ClassShift)
            .OrderByDescending(x => x.DrawDate)
            .Select(x => new LotteryDrawResponse
            {
                Id = x.Id,
                AdmissionCircularId = x.AdmissionCircularId,
                CircularTitle = x.AdmissionCircular.Title,
                ClassShiftId = x.ClassShiftId,
                ShiftName = x.ClassShift.ShiftName,
                DrawDate = x.DrawDate,
                IsPublished = x.IsPublished,
                TotalEligibleStudents = x.TotalEligibleStudents,
                TotalSelectedStudents = x.TotalSelectedStudents
            })
            .ToListAsync();
    }

    public async Task<List<LotteryResultResponse>> RunLotteryAsync(
        RunLotteryRequest request,
        Guid drawnByUserId)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable
            );

        var shift = await _context.ClassShifts
            .FromSqlInterpolated($"""
                SELECT *
                FROM "ClassShifts"
                WHERE "Id" = {request.ClassShiftId}
                FOR UPDATE
                """)
            .AsTracking()
            .FirstOrDefaultAsync();

        if (shift == null || !shift.IsActive)
            throw new KeyNotFoundException("Class shift not found.");

        var circular = await _context.AdmissionCirculars
            .FirstOrDefaultAsync(x =>
                x.Id == request.AdmissionCircularId &&
                x.IsPublished &&
                !x.IsDeleted
            );

        if (circular == null)
            throw new KeyNotFoundException("Circular not found.");

        var alreadyDrawn = await _context.LotteryDraws
            .AnyAsync(x =>
                x.AdmissionCircularId == request.AdmissionCircularId &&
                x.ClassShiftId == request.ClassShiftId
            );

        if (alreadyDrawn)
            throw new InvalidOperationException(
                "Lottery has already been conducted for this shift."
            );

        var eligibleStudents = await _context.StudentIds
            .Where(x =>
                x.AdmissionCircularId == request.AdmissionCircularId &&
                x.ClassShiftId == request.ClassShiftId &&
                x.IsPaymentCompleted &&
                x.IsLotteryEligible
            )
            .ToListAsync();

        if (eligibleStudents.Count == 0)
            throw new InvalidOperationException(
                "No eligible students found."
            );

        // Cryptographically secure Fisher-Yates shuffle.
        for (var i = eligibleStudents.Count - 1; i > 0; i--)
        {
            var j = RandomNumberGenerator.GetInt32(i + 1);

            (eligibleStudents[i], eligibleStudents[j]) =
                (eligibleStudents[j], eligibleStudents[i]);
        }

        var selectedCount = Math.Min(
            shift.TotalSeats,
            eligibleStudents.Count
        );

        var now = DateTime.UtcNow;

        var draw = new LotteryDraw
        {
            Id = Guid.NewGuid(),
            AdmissionCircularId = request.AdmissionCircularId,
            ClassShiftId = request.ClassShiftId,
            DrawDate = now,
            IsPublished = false,
            DrawnByUserId = drawnByUserId,
            TotalEligibleStudents = eligibleStudents.Count,
            TotalSelectedStudents = selectedCount
        };

        _context.LotteryDraws.Add(draw);

        var results = new List<LotteryResult>();

        for (var i = 0; i < eligibleStudents.Count; i++)
        {
            var student = eligibleStudents[i];

            var selected = i < selectedCount;

            student.IsSelectedInLottery = selected;

            results.Add(new LotteryResult
            {
                Id = Guid.NewGuid(),
                LotteryDrawId = draw.Id,
                StudentIdId = student.Id,
                Position = i + 1,
                IsSelected = selected,
                CreatedAt = now
            });
        }

        _context.LotteryResults.AddRange(results);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return results
            .OrderBy(x => x.Position)
            .Select(x => new LotteryResultResponse
            {
                LotteryDrawId = draw.Id,
                StudentId = x.StudentIdId,
                RegistrationNumber = eligibleStudents
                    .First(s => s.Id == x.StudentIdId)
                    .RegistrationNumber,
                Position = x.Position,
                IsSelected = x.IsSelected,
                DrawDate = draw.DrawDate,
                Result = x.IsSelected
                    ? "Selected"
                    : "Not Selected"
            })
            .ToList();
    }

    public async Task PublishLotteryResultAsync(Guid lotteryDrawId)
    {
        var draw = await _context.LotteryDraws
            .FirstOrDefaultAsync(x => x.Id == lotteryDrawId);

        if (draw == null)
            throw new KeyNotFoundException("Lottery draw not found.");

        if (draw.IsPublished)
            throw new InvalidOperationException(
                "Lottery result is already published."
            );

        draw.IsPublished = true;

        await _context.SaveChangesAsync();
    }

    public async Task<List<LotteryResultResponse>> GetPublishedResultAsync(
        Guid circularId,
        Guid shiftId)
    {
        var draw = await _context.LotteryDraws
            .AsNoTracking()
            .Include(x => x.Results)
                .ThenInclude(x => x.StudentId)
            .FirstOrDefaultAsync(x =>
                x.AdmissionCircularId == circularId &&
                x.ClassShiftId == shiftId &&
                x.IsPublished
            );

        if (draw == null)
            throw new KeyNotFoundException(
                "Published lottery result not found."
            );

        return draw.Results
            .OrderBy(x => x.Position)
            .Select(x => new LotteryResultResponse
            {
                LotteryDrawId = draw.Id,
                StudentId = x.StudentIdId,
                RegistrationNumber =
                    x.StudentId.RegistrationNumber,
                Position = x.Position,
                IsSelected = x.IsSelected,
                DrawDate = draw.DrawDate,
                Result = x.IsSelected
                    ? "Selected"
                    : "Not Selected"
            })
            .ToList();
    }
}