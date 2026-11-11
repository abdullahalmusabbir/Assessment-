using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize(Roles = "Admin,AdmissionOffice")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _service;

    public ReportsController(IReportService service)
    {
        _service = service;
    }

    // GET: api/reports/admissions
    [HttpGet("admissions")]
    public async Task<IActionResult> AdmissionReport(
        [FromQuery] Guid? circularId)
    {
        var result = await _service.GetAdmissionReportAsync(
            circularId
        );

        return Ok(result);
    }
}