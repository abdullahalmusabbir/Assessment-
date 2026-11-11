using backend.Data;
using backend.DTOs.Reports;
using backend.Enums;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdmissionReportResponse>>
        GetAdmissionReportAsync(Guid? circularId)
    {
        var now = DateTime.UtcNow;

        var query = _context.ClassShifts
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        if (circularId.HasValue)
        {
            query = query.Where(x =>
                _context.AdmissionCirculars.Any(c =>
                    c.Id == circularId.Value &&
                    c.IsPublished &&
                    !c.IsDeleted
                )
            );
        }

        var shifts = await query
            .Select(x => new
            {
                x.Id,
                x.ShiftName,
                x.TotalSeats
            })
            .ToListAsync();

        var reports = new List<AdmissionReportResponse>();

        foreach (var shift in shifts)
        {
            var applications = _context.StudentIds
                .Where(x => x.ClassShiftId == shift.Id);

            if (circularId.HasValue)
            {
                applications = applications.Where(x =>
                    x.AdmissionCircularId == circularId.Value
                );
            }

            var studentIds = await applications
                .Select(x => x.Id)
                .ToListAsync();

            var ids = studentIds.ToList();

            var holds = _context.AdmissionHolds
                .Where(x => ids.Contains(x.StudentIdId));

            var eligible = await applications
                .CountAsync(x =>
                    x.IsPaymentCompleted &&
                    x.IsLotteryEligible
                );

            var selected = await applications
                .CountAsync(x => x.IsSelectedInLottery);

            var collected = await _context.Payments
                .Where(x =>
                    ids.Contains(x.StudentIdId) &&
                    x.Status == PaymentStatus.Successful
                )
                .SumAsync(x => (decimal?)x.Amount) ?? 0;

            var circulars = await _context.AdmissionCirculars
                .Where(x =>
                    !circularId.HasValue ||
                    x.Id == circularId.Value
                )
                .ToListAsync();

            foreach (var circular in circulars)
            {
                var circularStudentIds = await _context.StudentIds
                    .Where(x =>
                        x.ClassShiftId == shift.Id &&
                        x.AdmissionCircularId == circular.Id
                    )
                    .Select(x => x.Id)
                    .ToListAsync();

                var circularHolds = _context.AdmissionHolds
                    .Where(x =>
                        circularStudentIds.Contains(x.StudentIdId)
                    );

                var report = new AdmissionReportResponse
                {
                    CircularId = circular.Id,
                    CircularTitle = circular.Title,
                    ClassShiftId = shift.Id,
                    ShiftName = shift.ShiftName,
                    TotalSeats = shift.TotalSeats,

                    TotalApplications = circularStudentIds.Count,

                    ActiveHolds = await circularHolds.CountAsync(x =>
                        x.Status == AdmissionHoldStatus.HELD &&
                        x.ExpiresAt > now
                    ),

                    ConfirmedAdmissions = await circularHolds.CountAsync(x =>
                        x.Status == AdmissionHoldStatus.CONFIRMED
                    ),

                    LotteryEligible = await _context.StudentIds
                        .CountAsync(x =>
                            circularStudentIds.Contains(x.Id) &&
                            x.IsLotteryEligible
                        ),

                    LotterySelected = await _context.StudentIds
                        .CountAsync(x =>
                            circularStudentIds.Contains(x.Id) &&
                            x.IsSelectedInLottery
                        ),

                    TotalCollectedAmount = await _context.Payments
                        .Where(x =>
                            circularStudentIds.Contains(x.StudentIdId) &&
                            x.Status == PaymentStatus.Successful
                        )
                        .SumAsync(x => (decimal?)x.Amount) ?? 0
                };

                reports.Add(report);
            }
        }

        return reports;
    }
}