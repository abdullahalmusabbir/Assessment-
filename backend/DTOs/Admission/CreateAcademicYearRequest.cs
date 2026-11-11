using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class CreateAcademicYearRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(2000, 2100)]
    public int Year { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public string? Description { get; set; }
}