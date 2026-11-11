using backend.Models.Identity;
using backend.Models.Academic;
using backend.Models.Admission;
using Microsoft.EntityFrameworkCore;
using backend.Enums;

namespace backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options
    ) : base(options)
    {
    }
    
    public DbSet<User> Users => Set<User>();

    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();

    public DbSet<AdmissionOfficeProfile> AdmissionOfficeProfiles
        => Set<AdmissionOfficeProfile>();

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    public DbSet<PasswordResetToken> PasswordResetTokens
        => Set<PasswordResetToken>();

    public DbSet<AcademicYear> AcademicYears => Set<AcademicYear>();

    public DbSet<SchoolClass> SchoolClasses => Set<SchoolClass>();

    public DbSet<ClassShift> ClassShifts => Set<ClassShift>();

    public DbSet<AdmissionCircular> AdmissionCirculars
        => Set<AdmissionCircular>();

    public DbSet<StudentId> StudentIds => Set<StudentId>();

    public DbSet<AdmissionHold> AdmissionHolds => Set<AdmissionHold>();

    public DbSet<LotteryDraw> LotteryDraws => Set<LotteryDraw>();

    public DbSet<LotteryResult> LotteryResults => Set<LotteryResult>();

    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================================
        // ACADEMIC YEAR
        // =========================================

        modelBuilder.Entity<AcademicYear>()
            .HasIndex(x => x.Year)
            .IsUnique();

        modelBuilder.Entity<AcademicYear>()
            .Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        // =========================================
        // SCHOOL CLASS
        // =========================================

        modelBuilder.Entity<SchoolClass>()
            .HasIndex(x => x.ClassNumber)
            .IsUnique();

        // =========================================
        // CLASS SHIFT
        // =========================================

        modelBuilder.Entity<ClassShift>()
            .HasOne(x => x.SchoolClass)
            .WithMany(x => x.Shifts)
            .HasForeignKey(x => x.SchoolClassId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ClassShift>()
            .HasIndex(x => new
            {
                x.SchoolClassId,
                x.ShiftName
            })
            .IsUnique();

        modelBuilder.Entity<ClassShift>()
            .Property(x => x.AdmissionFee)
            .HasPrecision(18, 2);

        modelBuilder.Entity<ClassShift>()
            .ToTable(t => t.HasCheckConstraint(
                "CK_ClassShifts_TotalSeats",
                "\"TotalSeats\" >= 0"
            ));

        // =========================================
        // ADMISSION CIRCULAR
        // =========================================

        modelBuilder.Entity<AdmissionCircular>()
            .HasOne(x => x.AcademicYear)
            .WithMany(x => x.AdmissionCirculars)
            .HasForeignKey(x => x.AcademicYearId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AdmissionCircular>()
            .HasIndex(x => new
            {
                x.AcademicYearId,
                x.Title
            });

        // =========================================
        // STUDENT ID
        // =========================================

        modelBuilder.Entity<StudentId>()
            .HasIndex(x => x.RegistrationNumber)
            .IsUnique();

        modelBuilder.Entity<StudentId>()
            .HasIndex(x => new
            {
                x.UserId,
                x.ClassShiftId,
                x.AdmissionCircularId
            })
            .IsUnique();

        modelBuilder.Entity<StudentId>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StudentId>()
            .HasOne(x => x.ClassShift)
            .WithMany(x => x.StudentIds)
            .HasForeignKey(x => x.ClassShiftId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StudentId>()
            .HasOne(x => x.AdmissionCircular)
            .WithMany(x => x.StudentIds)
            .HasForeignKey(x => x.AdmissionCircularId)
            .OnDelete(DeleteBehavior.Restrict);

        // =========================================
        // ADMISSION HOLD
        // =========================================

        modelBuilder.Entity<AdmissionHold>()
            .HasOne(x => x.StudentId)
            .WithOne(x => x.AdmissionHold)
            .HasForeignKey<AdmissionHold>(x => x.StudentIdId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AdmissionHold>()
            .HasIndex(x => x.StudentIdId)
            .IsUnique();

        modelBuilder.Entity<AdmissionHold>()
            .HasOne(x => x.ClassShift)
            .WithMany(x => x.AdmissionHolds)
            .HasForeignKey(x => x.ClassShiftId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AdmissionHold>()
            .HasOne(x => x.AdmissionCircular)
            .WithMany(x => x.AdmissionHolds)
            .HasForeignKey(x => x.AdmissionCircularId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AdmissionHold>()
            .HasIndex(x => new
            {
                x.ClassShiftId,
                x.Status,
                x.ExpiresAt
            });

        // =========================================
        // LOTTERY DRAW
        // =========================================

        modelBuilder.Entity<LotteryDraw>()
            .HasOne(x => x.AdmissionCircular)
            .WithMany()
            .HasForeignKey(x => x.AdmissionCircularId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LotteryDraw>()
            .HasOne(x => x.ClassShift)
            .WithMany()
            .HasForeignKey(x => x.ClassShiftId)
            .OnDelete(DeleteBehavior.Restrict);

        // =========================================
        // LOTTERY RESULT
        // =========================================

        modelBuilder.Entity<LotteryResult>()
            .HasOne(x => x.LotteryDraw)
            .WithMany(x => x.Results)
            .HasForeignKey(x => x.LotteryDrawId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LotteryResult>()
            .HasOne(x => x.StudentId)
            .WithMany()
            .HasForeignKey(x => x.StudentIdId)
            .OnDelete(DeleteBehavior.Restrict);

        // =========================================
        // PAYMENT
        // =========================================

        modelBuilder.Entity<Payment>()
            .HasOne(x => x.StudentId)
            .WithMany(x => x.Payments)
            .HasForeignKey(x => x.StudentIdId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Payment>()
            .HasOne(x => x.AdmissionHold)
            .WithMany()
            .HasForeignKey(x => x.AdmissionHoldId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Payment>()
            .HasIndex(x => x.TransactionId)
            .IsUnique();

        modelBuilder.Entity<Payment>()
            .HasIndex(x => x.IdempotencyKey)
            .IsUnique();

        modelBuilder.Entity<Payment>()
            .Property(x => x.Amount)
            .HasPrecision(18, 2);
    }
}