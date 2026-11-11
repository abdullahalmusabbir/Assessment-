namespace backend.DTOs.Lottery;

public class LotteryDrawResponse
{
    public Guid Id { get; set; }
    public Guid AdmissionCircularId { get; set; }
    public string CircularTitle { get; set; } = string.Empty;
    public Guid ClassShiftId { get; set; }
    public string ShiftName { get; set; } = string.Empty;
    public DateTime DrawDate { get; set; }
    public bool IsPublished { get; set; }
    public int TotalEligibleStudents { get; set; }
    public int TotalSelectedStudents { get; set; }
}