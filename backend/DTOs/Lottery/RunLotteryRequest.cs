using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Lottery;

public class RunLotteryRequest
{
    [Required]
    public Guid AdmissionCircularId { get; set; }

    [Required]
    public Guid ClassShiftId { get; set; }
}