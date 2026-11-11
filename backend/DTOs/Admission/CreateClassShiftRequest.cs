using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class CreateClassShiftRequest
{
    [Required]
    public Guid SchoolClassId { get; set; }

    [Required]
    [StringLength(50)]
    public string ShiftName { get; set; } = string.Empty;

    [Range(1, 10000)]
    public int TotalSeats { get; set; }

    [Range(1, 25)]
    public int MinimumAge { get; set; }

    [Range(1, 30)]
    public int MaximumAge { get; set; }

    [Range(0, 1000000)]
    public decimal AdmissionFee { get; set; }

    public string? Description { get; set; }
}