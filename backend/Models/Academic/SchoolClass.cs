using backend.Models.Common;

namespace backend.Models.Academic;

public class SchoolClass : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int ClassNumber { get; set; }

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public ICollection<ClassShift> Shifts { get; set; }
        = new List<ClassShift>();
}