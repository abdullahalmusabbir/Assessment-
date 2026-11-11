using backend.DTOs.Admission;
using backend.DTOs.Admin;

namespace backend.Interfaces;

public interface IAdmissionService
{
    Task<AcademicYearResponse> CreateAcademicYearAsync(
        CreateAcademicYearRequest request
    );
    

    Task<AcademicYearResponse> UpdateAcademicYearAsync(
        Guid id,
        UpdateAcademicYearRequest request
    );

    Task<List<AcademicYearResponse>> GetAcademicYearsAsync();

    Task<ClassResponse> CreateClassAsync(
        CreateClassRequest request
    );

    Task<ClassResponse> UpdateClassAsync(
        Guid id,
        UpdateClassRequest request
    );

    Task<List<ClassResponse>> GetClassesAsync();

    Task<ClassShiftResponse> CreateClassShiftAsync(
        CreateClassShiftRequest request
    );

    Task<CircularResponse> CreateCircularAsync(
        CreateCircularRequest request,
        Guid createdByUserId
    );

    Task<CircularResponse> UpdateCircularAsync(
        Guid id,
        UpdateCircularRequest request,
        Guid modifiedByUserId
    );

    Task SetAdmissionStatusAsync(
        Guid academicYearId,
        bool isOpen
    );

    Task PublishCircularAsync(Guid circularId);

    Task<List<CircularResponse>> GetPublishedCircularsAsync();

    Task<List<CircularResponse>> GetAllCircularsAsync();

    Task<List<ApplicationResponse>> GetAllApplicationsAsync();

    Task<ApplicationResponse> ApplyAsync(
        Guid userId,
        ApplyAdmissionRequest request
    );

    Task<List<ApplicationResponse>> GetMyApplicationsAsync(
        Guid userId
    );
}

public class AcademicYearResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Year { get; set; }
    public bool IsCurrent { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}

public class ClassResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int ClassNumber { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}

public class ClassShiftResponse
{
    public Guid Id { get; set; }
    public Guid SchoolClassId { get; set; }
    public string ShiftName { get; set; } = string.Empty;
    
    public int TotalSeats { get; set; }
    public decimal AdmissionFee { get; set; }
}