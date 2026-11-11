using System.Security.Claims;
using backend.DTOs.Admission;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/student-applications")]
[Authorize(Roles = "Admin,AdmissionOffice,Student")]
public class StudentApplicationsController : ControllerBase
{
    private readonly IAdmissionService _admissionService;

    public StudentApplicationsController(
        IAdmissionService admissionService)
    {
        _admissionService = admissionService;
    }

    private Guid CurrentUserId()
    {
        var value = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!Guid.TryParse(value, out var id))
            throw new UnauthorizedAccessException();

        return id;
    }

    // GET: api/student-applications (Admin/AdmissionOffice list all)
    [HttpGet]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _admissionService.GetAllApplicationsAsync();
        return Ok(result);
    }

    // POST: api/student-applications
    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Apply(
        ApplyAdmissionRequest request)
    {
        try
        {
            var result = await _admissionService.ApplyAsync(
                CurrentUserId(),
                request
            );

            return StatusCode(
                StatusCodes.Status201Created,
                result
            );
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // GET: api/student-applications/my
    [HttpGet("my")]
    public async Task<IActionResult> MyApplications()
    {
        var result = await _admissionService.GetMyApplicationsAsync(
            CurrentUserId()
        );

        return Ok(result);
    }
}