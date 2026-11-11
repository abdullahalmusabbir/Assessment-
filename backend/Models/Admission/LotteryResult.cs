using backend.Models.Common;

namespace backend.Models.Admission;

public class LotteryResult : BaseEntity
{
    public Guid LotteryDrawId { get; set; }

    public Guid StudentIdId { get; set; }

    public int Position { get; set; }

    public bool IsSelected { get; set; }

    public DateTime CreatedAt { get; set; }

    public LotteryDraw LotteryDraw { get; set; } = null!;

    public StudentId StudentId { get; set; } = null!;
}