namespace backend.DTOs.Admission;

public class CircularResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int AcademicYear { get; set; }

    public DateTime ApplicationStartDate { get; set; }

    public DateTime ApplicationEndDate { get; set; }

    public DateTime PaymentDeadline { get; set; }

    public string? AttachmentUrl { get; set; }

    public bool IsPublished { get; set; }

    public bool IsActive { get; set; }
}