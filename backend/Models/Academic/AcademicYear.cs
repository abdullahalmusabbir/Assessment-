using backend.Models.Common;
using backend.Models.Admission;

namespace backend.Models.Academic;

public class AcademicYear : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public int Year { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsCurrent { get; set; }

    public bool IsAdmissionOpen { get; set; }

    public string? Description { get; set; }

    public ICollection<AdmissionCircular> AdmissionCirculars { get; set; }
        = new List<AdmissionCircular>();
}