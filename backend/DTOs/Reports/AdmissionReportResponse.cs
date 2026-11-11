namespace backend.DTOs.Reports;

public class AdmissionReportResponse
{
    public Guid CircularId { get; set; }

    public string CircularTitle { get; set; } = string.Empty;

    public Guid ClassShiftId { get; set; }

    public string ShiftName { get; set; } = string.Empty;

    public int TotalSeats { get; set; }

    public int TotalApplications { get; set; }

    public int ActiveHolds { get; set; }

    public int ConfirmedAdmissions { get; set; }

    public int LotteryEligible { get; set; }

    public int LotterySelected { get; set; }

    public decimal TotalCollectedAmount { get; set; }
}