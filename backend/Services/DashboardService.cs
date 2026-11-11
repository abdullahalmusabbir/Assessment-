using backend.Data;
using backend.DTOs.Dashboard;
using backend.Enums;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponse> GetDashboardAsync()
    {
        var now = DateTime.UtcNow;

        var result = new DashboardResponse
        {
            TotalUsers = await _context.Users
                .CountAsync(x => !x.IsDeleted),

            TotalStudents = await _context.Users
                .CountAsync(x =>
                    x.Role == UserRole.Student &&
                    !x.IsDeleted
                ),

            TotalAdmissionOffices = await _context.Users
                .CountAsync(x =>
                    x.Role == UserRole.AdmissionOffice &&
                    !x.IsDeleted
                ),

            TotalAdmins = await _context.Users
                .CountAsync(x =>
                    x.Role == UserRole.Admin &&
                    !x.IsDeleted
                ),

            TotalClasses = await _context.SchoolClasses
                .CountAsync(x => !x.IsDeleted),

            TotalClassShifts = await _context.ClassShifts
                .CountAsync(x => !x.IsDeleted),

            TotalCirculars = await _context.AdmissionCirculars
                .CountAsync(x => !x.IsDeleted),

            PublishedCirculars = await _context.AdmissionCirculars
                .CountAsync(x =>
                    x.IsPublished &&
                    x.IsActive &&
                    !x.IsDeleted
                ),

            TotalApplications = await _context.StudentIds.CountAsync(),

            ActiveHolds = await _context.AdmissionHolds
                .CountAsync(x =>
                    x.Status == AdmissionHoldStatus.HELD &&
                    x.ExpiresAt > now
                ),

            ConfirmedAdmissions = await _context.AdmissionHolds
                .CountAsync(x =>
                    x.Status == AdmissionHoldStatus.CONFIRMED
                ),

            ExpiredApplications = await _context.AdmissionHolds
                .CountAsync(x =>
                    x.Status == AdmissionHoldStatus.HELD &&
                    x.ExpiresAt <= now
                ),

            LotteryEligibleStudents = await _context.StudentIds
                .CountAsync(x => x.IsLotteryEligible),

            SuccessfulPayments = await _context.Payments
                .CountAsync(x =>
                    x.Status == PaymentStatus.Successful
                ),

            PendingPayments = await _context.Payments
                .CountAsync(x =>
                    x.Status == PaymentStatus.Pending ||
                    x.Status == PaymentStatus.Processing
                ),

            TotalSuccessfulPaymentAmount = await _context.Payments
                .Where(x => x.Status == PaymentStatus.Successful)
                .SumAsync(x => (decimal?)x.Amount) ?? 0
        };

        return result;
    }
}