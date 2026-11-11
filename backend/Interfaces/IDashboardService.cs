using backend.DTOs.Dashboard;

namespace backend.Interfaces;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync();
}