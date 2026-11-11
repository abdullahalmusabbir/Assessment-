namespace backend.DTOs.Dashboard;

public class DashboardResponse
{
    public int TotalUsers { get; set; }

    public int TotalStudents { get; set; }

    public int TotalAdmissionOffices { get; set; }

    public int TotalAdmins { get; set; }

    public int TotalClasses { get; set; }

    public int TotalClassShifts { get; set; }

    public int TotalCirculars { get; set; }

    public int PublishedCirculars { get; set; }

    public int TotalApplications { get; set; }

    public int ActiveHolds { get; set; }

    public int ConfirmedAdmissions { get; set; }

    public int ExpiredApplications { get; set; }

    public int LotteryEligibleStudents { get; set; }

    public decimal TotalSuccessfulPaymentAmount { get; set; }

    public int SuccessfulPayments { get; set; }

    public int PendingPayments { get; set; }
}