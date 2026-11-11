using backend.Data;
using backend.DTOs.Admission;
using backend.DTOs.Admin;
using backend.Enums;
using backend.Interfaces;
using backend.Models.Academic;
using backend.Models.Admission;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Services;

public class AdmissionService : IAdmissionService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AdmissionService(
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    private static DateTime ToUtc(DateTime dateTime)
    {
        if (dateTime.Kind == DateTimeKind.Utc)
            return dateTime;
        return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
    }

    public async Task SetAdmissionStatusAsync(
        Guid academicYearId,
        bool isOpen)
    {
        var academicYear = await _context.AcademicYears
            .FirstOrDefaultAsync(x =>
                x.Id == academicYearId &&
                !x.IsDeleted
            );

        if (academicYear == null)
            throw new KeyNotFoundException("Academic year not found.");

        academicYear.IsAdmissionOpen = isOpen;

        await _context.SaveChangesAsync();
    }

    public async Task<List<AcademicYearResponse>> GetAcademicYearsAsync()
    {
        return await _context.AcademicYears
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.Year)
            .Select(x => new AcademicYearResponse
            {
                Id = x.Id,
                Name = x.Name,
                Year = x.Year,
                IsCurrent = x.IsCurrent,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                IsActive = x.IsAdmissionOpen
            })
            .ToListAsync();
    }

    public async Task<List<ClassResponse>> GetClassesAsync()
    {
        return await _context.SchoolClasses
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.ClassNumber)
            .Select(x => new ClassResponse
            {
                Id = x.Id,
                Name = x.Name,
                ClassNumber = x.ClassNumber,
                Description = x.Description,
                IsActive = x.IsActive
            })
            .ToListAsync();
    }

    // =========================================
    // CREATE ACADEMIC YEAR
    // =========================================

    public async Task<AcademicYearResponse> CreateAcademicYearAsync(
        CreateAcademicYearRequest request)
    {
        if (request.EndDate <= request.StartDate)
            throw new ArgumentException(
                "End date must be after start date."
            );

        var exists = await _context.AcademicYears
            .AnyAsync(x => x.Year == request.Year);

        if (exists)
            throw new InvalidOperationException(
                "Academic year already exists."
            );

        var now = DateTime.UtcNow;

        var entity = new AcademicYear
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Year = request.Year,
            StartDate = ToUtc(request.StartDate),
            EndDate = ToUtc(request.EndDate),
            Description = request.Description,
            IsCurrent = false,
            IsAdmissionOpen = false,
            IsDeleted = false,
            CreatedAt = now,
            UpdatedAt = now,
            DeletedAt = null
        };

        _context.AcademicYears.Add(entity);

        await _context.SaveChangesAsync();

        return new AcademicYearResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            Year = entity.Year,
            IsCurrent = entity.IsCurrent,
            StartDate = entity.StartDate,
            EndDate = entity.EndDate,
            IsActive = entity.IsAdmissionOpen
        };
    }

    // =========================================
    // UPDATE ACADEMIC YEAR
    // =========================================

    public async Task<AcademicYearResponse> UpdateAcademicYearAsync(
        Guid id,
        UpdateAcademicYearRequest request)
    {
        var academicYear = await _context.AcademicYears
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                !x.IsDeleted
            );

        if (academicYear == null)
            throw new KeyNotFoundException("Academic year not found.");

        if (request.EndDate <= request.StartDate)
            throw new ArgumentException(
                "End date must be after start date."
            );

        var yearExists = await _context.AcademicYears
            .AnyAsync(x =>
                x.Year == request.Year &&
                x.Id != id &&
                !x.IsDeleted
            );

        if (yearExists)
            throw new InvalidOperationException(
                "Academic year already exists."
            );

        academicYear.Name = request.Name.Trim();
        academicYear.Year = request.Year;
        academicYear.StartDate = ToUtc(request.StartDate);
        academicYear.EndDate = ToUtc(request.EndDate);
        academicYear.Description = request.Description;
        academicYear.IsAdmissionOpen = request.IsActive;
        academicYear.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new AcademicYearResponse
        {
            Id = academicYear.Id,
            Name = academicYear.Name,
            Year = academicYear.Year,
            IsCurrent = academicYear.IsCurrent,
            StartDate = academicYear.StartDate,
            EndDate = academicYear.EndDate,
            IsActive = academicYear.IsAdmissionOpen
        };
    }

    // =========================================
    // CREATE SCHOOL CLASS
    // =========================================

    public async Task<ClassResponse> CreateClassAsync(
        CreateClassRequest request)
    {
        var exists = await _context.SchoolClasses
            .AnyAsync(x =>
                x.ClassNumber == request.ClassNumber &&
                !x.IsDeleted
            );

        if (exists)
            throw new InvalidOperationException(
                "Class number already exists."
            );

        var now = DateTime.UtcNow;

        var entity = new SchoolClass
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = request.Description,
            ClassNumber = request.ClassNumber,
            DisplayOrder = request.DisplayOrder,
            IsActive = true,
            IsDeleted = false,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.SchoolClasses.Add(entity);

        await _context.SaveChangesAsync();

        return new ClassResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            ClassNumber = entity.ClassNumber,
            Description = entity.Description,
            IsActive = entity.IsActive
        };
    }

    // =========================================
    // UPDATE SCHOOL CLASS
    // =========================================

    public async Task<ClassResponse> UpdateClassAsync(
        Guid id,
        UpdateClassRequest request)
    {
        var schoolClass = await _context.SchoolClasses
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                !x.IsDeleted
            );

        if (schoolClass == null)
            throw new KeyNotFoundException("Class not found.");

        var classNumberExists = await _context.SchoolClasses
            .AnyAsync(x =>
                x.ClassNumber == request.ClassNumber &&
                x.Id != id &&
                !x.IsDeleted
            );

        if (classNumberExists)
            throw new InvalidOperationException(
                "Class number already exists."
            );

        var now = DateTime.UtcNow;

        schoolClass.Name = request.Name.Trim();
        schoolClass.Description = request.Description;
        schoolClass.ClassNumber = request.ClassNumber;
        schoolClass.DisplayOrder = request.DisplayOrder;
        schoolClass.IsActive = request.IsActive;
        schoolClass.UpdatedAt = now;

        await _context.SaveChangesAsync();

        return new ClassResponse
        {
            Id = schoolClass.Id,
            Name = schoolClass.Name,
            ClassNumber = schoolClass.ClassNumber,
            Description = schoolClass.Description,
            IsActive = schoolClass.IsActive
        };
    }

    // =========================================
    // CREATE CLASS SHIFT
    // =========================================

    public async Task<ClassShiftResponse> CreateClassShiftAsync(
        CreateClassShiftRequest request)
    {
        if (request.MaximumAge < request.MinimumAge)
            throw new ArgumentException(
                "Maximum age must be greater than or equal to minimum age."
            );

        var schoolClass = await _context.SchoolClasses
            .FirstOrDefaultAsync(x =>
                x.Id == request.SchoolClassId &&
                x.IsActive &&
                !x.IsDeleted
            );

        if (schoolClass == null)
            throw new KeyNotFoundException("Class not found.");

        var duplicate = await _context.ClassShifts
            .AnyAsync(x =>
                x.SchoolClassId == request.SchoolClassId &&
                x.ShiftName.ToLower() == request.ShiftName.ToLower() &&
                !x.IsDeleted
            );

        if (duplicate)
            throw new InvalidOperationException(
                "This shift already exists for the class."
            );

        var now = DateTime.UtcNow;

        var entity = new ClassShift
        {
            Id = Guid.NewGuid(),
            SchoolClassId = request.SchoolClassId,
            ShiftName = request.ShiftName.Trim(),
            TotalSeats = request.TotalSeats,
            MinimumAge = request.MinimumAge,
            MaximumAge = request.MaximumAge,
            AdmissionFee = request.AdmissionFee,
            IsActive = true,
            IsDeleted = false,
            Description = request.Description,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.ClassShifts.Add(entity);

        await _context.SaveChangesAsync();

        return new ClassShiftResponse
        {
            Id = entity.Id,
            SchoolClassId = entity.SchoolClassId,
            ShiftName = entity.ShiftName,
            TotalSeats = entity.TotalSeats,
            AdmissionFee = entity.AdmissionFee
        };
    }

    // =========================================
    // CREATE ADMISSION CIRCULAR
    // =========================================

    public async Task<CircularResponse> CreateCircularAsync(
        CreateCircularRequest request,
        Guid createdByUserId)
    {
        if (request.ApplicationEndDate <= request.ApplicationStartDate)
            throw new ArgumentException(
                "Application end date must be after start date."
            );

        if (request.PaymentDeadline < request.ApplicationEndDate)
            throw new ArgumentException(
                "Payment deadline cannot be earlier than application end date."
            );

        var academicYear = await _context.AcademicYears
            .FirstOrDefaultAsync(x =>
                x.Id == request.AcademicYearId &&
                !x.IsDeleted
            );

        if (academicYear == null)
            throw new KeyNotFoundException(
                "Academic year not found."
            );

        var now = DateTime.UtcNow;

        var entity = new AdmissionCircular
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description,
            AcademicYearId = request.AcademicYearId,
            ApplicationStartDate = ToUtc(request.ApplicationStartDate),
            ApplicationEndDate = ToUtc(request.ApplicationEndDate),
            PaymentDeadline = ToUtc(request.PaymentDeadline),
            AttachmentUrl = request.AttachmentUrl,
            CreatedByUserId = createdByUserId,
            IsPublished = false,
            IsActive = true,
            IsDeleted = false,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.AdmissionCirculars.Add(entity);

        await _context.SaveChangesAsync();

        return MapCircular(entity, academicYear.Year);
    }

    // =========================================
    // UPDATE ADMISSION CIRCULAR
    // =========================================

    public async Task<CircularResponse> UpdateCircularAsync(
        Guid id,
        UpdateCircularRequest request,
        Guid modifiedByUserId)
    {
        if (request.ApplicationEndDate <= request.ApplicationStartDate)
            throw new ArgumentException(
                "Application end date must be after start date."
            );

        if (request.PaymentDeadline < request.ApplicationEndDate)
            throw new ArgumentException(
                "Payment deadline cannot be earlier than application end date."
            );

        var circular = await _context.AdmissionCirculars
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                !x.IsDeleted
            );

        if (circular == null)
            throw new KeyNotFoundException(
                "Admission circular not found."
            );

        var academicYear = await _context.AcademicYears
            .FirstOrDefaultAsync(x =>
                x.Id == request.AcademicYearId &&
                !x.IsDeleted
            );

        if (academicYear == null)
            throw new KeyNotFoundException(
                "Academic year not found."
            );

        circular.Title = request.Title.Trim();
        circular.Description = request.Description;
        circular.AcademicYearId = request.AcademicYearId;
        circular.ApplicationStartDate = ToUtc(request.ApplicationStartDate);
        circular.ApplicationEndDate = ToUtc(request.ApplicationEndDate);
        circular.PaymentDeadline = ToUtc(request.PaymentDeadline);
        circular.AttachmentUrl = request.AttachmentUrl;
        circular.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapCircular(circular, academicYear.Year);
    }

    // =========================================
    // PUBLISH CIRCULAR
    // =========================================

    public async Task PublishCircularAsync(Guid circularId)
    {
        var circular = await _context.AdmissionCirculars
            .FirstOrDefaultAsync(x =>
                x.Id == circularId &&
                !x.IsDeleted
            );

        if (circular == null)
            throw new KeyNotFoundException(
                "Admission circular not found."
            );

        var academicYear = await _context.AcademicYears
            .FirstAsync(x => x.Id == circular.AcademicYearId);

        if (!academicYear.IsAdmissionOpen)
            throw new InvalidOperationException(
                "Admission is not open for this academic year."
            );

        circular.IsPublished = true;
        circular.IsActive = true;

        await _context.SaveChangesAsync();
    }

    // =========================================
    // GET PUBLISHED CIRCULARS
    // =========================================

    public async Task<List<CircularResponse>> GetPublishedCircularsAsync()
    {
        var now = DateTime.UtcNow;

        return await _context.AdmissionCirculars
            .AsNoTracking()
            .Where(x =>
                x.IsPublished &&
                x.IsActive &&
                !x.IsDeleted &&
                x.ApplicationEndDate >= now
            )
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CircularResponse
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                AcademicYear = x.AcademicYear.Year,
                ApplicationStartDate = x.ApplicationStartDate,
                ApplicationEndDate = x.ApplicationEndDate,
                PaymentDeadline = x.PaymentDeadline,
                AttachmentUrl = x.AttachmentUrl,
                IsPublished = x.IsPublished,
                IsActive = x.IsActive
            })
            .ToListAsync();
    }

    // =========================================
    // GET ALL CIRCULARS (ADMIN LIST)
    // =========================================

    public async Task<List<CircularResponse>> GetAllCircularsAsync()
    {
        return await _context.AdmissionCirculars
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CircularResponse
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                AcademicYear = x.AcademicYear.Year,
                ApplicationStartDate = x.ApplicationStartDate,
                ApplicationEndDate = x.ApplicationEndDate,
                PaymentDeadline = x.PaymentDeadline,
                AttachmentUrl = x.AttachmentUrl,
                IsPublished = x.IsPublished,
                IsActive = x.IsActive
            })
            .ToListAsync();
    }

    // =========================================
    // APPLY FOR ADMISSION
    // =========================================

    public async Task<ApplicationResponse> ApplyAsync(
        Guid userId,
        ApplyAdmissionRequest request)
    {
        var now = DateTime.UtcNow;

        var holdSeconds = _configuration.GetValue<int>(
            "Admission:HoldDurationSeconds"
        );

        if (holdSeconds <= 0)
            holdSeconds = 600;

        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable
            );

        try
        {
            var shift = await _context.ClassShifts
                .FromSqlInterpolated($"""
                    SELECT *
                    FROM "ClassShifts"
                    WHERE "Id" = {request.ClassShiftId}
                    FOR UPDATE
                    """)
                .AsTracking()
                .FirstOrDefaultAsync();

            if (shift == null ||
                !shift.IsActive ||
                shift.IsDeleted)
            {
                throw new KeyNotFoundException(
                    "Selected class shift is unavailable."
                );
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Id == userId &&
                    !x.IsDeleted
                );

            if (user == null || user.Status != UserStatus.Active)
                throw new UnauthorizedAccessException(
                    "Active student account required."
                );

            if (user.Role != UserRole.Student)
                throw new UnauthorizedAccessException(
                    "Only students can apply for admission."
                );

            var circular = await _context.AdmissionCirculars
                .FirstOrDefaultAsync(x =>
                    x.Id == request.AdmissionCircularId &&
                    x.IsPublished &&
                    x.IsActive &&
                    !x.IsDeleted
                );

            if (circular == null)
                throw new KeyNotFoundException(
                    "Published admission circular not found."
                );

            var academicYear = await _context.AcademicYears
                .FirstOrDefaultAsync(x => x.Id == circular.AcademicYearId);

            if (academicYear == null ||
                !academicYear.IsAdmissionOpen)
            {
                throw new InvalidOperationException(
                    "Admission is currently closed."
                );
            }

            if (now < circular.ApplicationStartDate ||
                now > circular.ApplicationEndDate)
            {
                throw new InvalidOperationException(
                    "Application period is not active."
                );
            }

            var classIsActive = await _context.SchoolClasses
                .AnyAsync(x =>
                    x.Id == shift.SchoolClassId &&
                    x.IsActive &&
                    !x.IsDeleted
                );

            if (!classIsActive)
                throw new InvalidOperationException(
                    "Selected class is not active."
                );

            var existingApplication = await _context.StudentIds
                .AnyAsync(x =>
                    x.UserId == userId &&
                    x.ClassShiftId == shift.Id &&
                    x.AdmissionCircularId == circular.Id
                );

            if (existingApplication)
                throw new InvalidOperationException(
                    "You have already applied for this class and circular."
                );

            var expiredHolds = await _context.AdmissionHolds
                .Where(x =>
                    x.ClassShiftId == shift.Id &&
                    x.Status == AdmissionHoldStatus.HELD &&
                    x.ExpiresAt <= now
                )
                .ToListAsync();

            foreach (var expiredHold in expiredHolds)
            {
                await DeleteExpiredApplicationAsync(expiredHold);
            }

            var occupiedSeats = await _context.AdmissionHolds
                .CountAsync(x =>
                    x.ClassShiftId == shift.Id &&
                    (
                        x.Status == AdmissionHoldStatus.CONFIRMED ||
                        (
                            x.Status == AdmissionHoldStatus.HELD &&
                            x.ExpiresAt > now
                        )
                    )
                );

            if (occupiedSeats >= shift.TotalSeats)
                throw new InvalidOperationException(
                    "No seats are currently available."
                );

            var registrationNumber =
                await GenerateRegistrationNumberAsync();

            var studentId = new StudentId
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = registrationNumber,
                UserId = userId,
                ClassShiftId = shift.Id,
                AdmissionCircularId = circular.Id,
                IsPaymentCompleted = false,
                IsLotteryEligible = false,
                IsSelectedInLottery = false,
                CreatedAt = now,
                UpdatedAt = now
            };

            var hold = new AdmissionHold
            {
                Id = Guid.NewGuid(),
                StudentIdId = studentId.Id,
                ClassShiftId = shift.Id,
                AdmissionCircularId = circular.Id,
                Status = AdmissionHoldStatus.HELD,
                HeldAt = now,
                ExpiresAt = now.AddSeconds(holdSeconds),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.StudentIds.Add(studentId);
            _context.AdmissionHolds.Add(hold);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return new ApplicationResponse
            {
                StudentId = studentId.Id,
                RegistrationNumber = studentId.RegistrationNumber,
                AdmissionHoldId = hold.Id,
                HoldStatus = hold.Status.ToString(),
                HoldExpiresAt = hold.ExpiresAt,
                AdmissionFee = shift.AdmissionFee,
                Message = "Application created. Complete payment before the hold expires."
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // =========================================
    // GET MY APPLICATIONS
    // =========================================

    public async Task<List<ApplicationResponse>> GetMyApplicationsAsync(
        Guid userId)
    {
        return await _context.StudentIds
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ApplicationResponse
            {
                StudentId = x.Id,
                RegistrationNumber = x.RegistrationNumber,
                AdmissionHoldId = x.AdmissionHold != null
                    ? x.AdmissionHold.Id
                    : Guid.Empty,
                HoldStatus = x.AdmissionHold != null
                    ? x.AdmissionHold.Status.ToString()
                    : "EXPIRED",
                HoldExpiresAt = x.AdmissionHold != null
                    ? x.AdmissionHold.ExpiresAt
                    : DateTime.MinValue,
                AdmissionFee = x.ClassShift.AdmissionFee,
                Message = x.IsPaymentCompleted
                    ? "Payment completed."
                    : "Payment pending."
            })
            .ToListAsync();
    }

    public async Task<List<ApplicationResponse>> GetAllApplicationsAsync()
    {
        return await _context.StudentIds
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .Include(x => x.User)
            .Include(x => x.ClassShift)
                .ThenInclude(x => x.SchoolClass)
            .Include(x => x.AdmissionCircular)
            .Include(x => x.AdmissionHold)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new ApplicationResponse
            {
                StudentId = x.Id,
                RegistrationNumber = x.RegistrationNumber,
                StudentName = $"{x.User.FirstName} {x.User.LastName}".Trim(),
                ClassName = $"{x.ClassShift.SchoolClass.Name} ({x.ClassShift.ShiftName})",
                CircularTitle = x.AdmissionCircular.Title,
                PaymentStatus = x.IsPaymentCompleted ? "Completed" : "Pending",
                HoldStatus = x.AdmissionHold != null
                    ? x.AdmissionHold.Status.ToString()
                    : "EXPIRED",
                HoldExpiresAt = x.AdmissionHold != null
                    ? x.AdmissionHold.ExpiresAt
                    : DateTime.MinValue,
                AdmissionFee = x.ClassShift.AdmissionFee,
                Message = x.IsPaymentCompleted
                    ? "Payment completed."
                    : "Payment pending."
            })
            .ToListAsync();
    }

    // =========================================
    // DELETE EXPIRED APPLICATION
    // =========================================

    public async Task DeleteExpiredApplicationAsync(
        AdmissionHold hold)
    {
        var pendingPayments = await _context.Payments
            .Where(x =>
                x.StudentIdId == hold.StudentIdId &&
                x.Status != PaymentStatus.Successful
            )
            .ToListAsync();

        _context.Payments.RemoveRange(pendingPayments);

        _context.AdmissionHolds.Remove(hold);

        var studentId = await _context.StudentIds
            .FirstOrDefaultAsync(x => x.Id == hold.StudentIdId);

        if (studentId != null && !studentId.IsPaymentCompleted)
        {
            _context.StudentIds.Remove(studentId);
        }

        await _context.SaveChangesAsync();
    }

    // =========================================
    // GENERATE REGISTRATION NUMBER
    // =========================================

    private async Task<string> GenerateRegistrationNumberAsync()
    {
        for (var attempt = 0; attempt < 5; attempt++)
        {
            var number =
                $"SCH-{DateTime.UtcNow:yyyy}-{Guid.NewGuid():N}"[..24]
                    .ToUpperInvariant();

            var exists = await _context.StudentIds
                .AnyAsync(x => x.RegistrationNumber == number);

            if (!exists)
                return number;
        }

        throw new InvalidOperationException(
            "Could not generate a unique registration number."
        );
    }

    // =========================================
    // MAP CIRCULAR
    // =========================================

    private static CircularResponse MapCircular(
        AdmissionCircular circular,
        int academicYear)
    {
        return new CircularResponse
        {
            Id = circular.Id,
            Title = circular.Title,
            Description = circular.Description,
            AcademicYear = academicYear,
            ApplicationStartDate = circular.ApplicationStartDate,
            ApplicationEndDate = circular.ApplicationEndDate,
            PaymentDeadline = circular.PaymentDeadline,
            AttachmentUrl = circular.AttachmentUrl,
            IsPublished = circular.IsPublished,
            IsActive = circular.IsActive
        };
    }
}