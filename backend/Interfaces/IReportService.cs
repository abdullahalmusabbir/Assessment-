using backend.DTOs.Reports;

namespace backend.Interfaces;

public interface IReportService
{
    Task<List<AdmissionReportResponse>> GetAdmissionReportAsync(
        Guid? circularId
    );
}