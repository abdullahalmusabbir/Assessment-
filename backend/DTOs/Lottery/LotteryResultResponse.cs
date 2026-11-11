namespace backend.DTOs.Lottery;

public class LotteryResultResponse
{
    public Guid LotteryDrawId { get; set; }

    public Guid StudentId { get; set; }

    public string RegistrationNumber { get; set; }
        = string.Empty;

    public int Position { get; set; }

    public bool IsSelected { get; set; }

    public DateTime DrawDate { get; set; }

    public string Result { get; set; } = string.Empty;
}