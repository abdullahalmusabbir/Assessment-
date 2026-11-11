using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class CreateClassRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(1, 20)]
    public int ClassNumber { get; set; }

    public int DisplayOrder { get; set; }
}