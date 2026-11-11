using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admission;

public class UpdateClassRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(1, 20)]
    public int ClassNumber { get; set; }

    public string? Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;
}