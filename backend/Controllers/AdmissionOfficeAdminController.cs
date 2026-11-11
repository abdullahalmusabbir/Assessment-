using System.Security.Claims;
using backend.DTOs.Admin;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admission-office")]
[Authorize(Roles = "AdmissionOffice")]
public class AdmissionOfficeAdminController : ControllerBase
{
    private readonly IAdminService _service;

    public AdmissionOfficeAdminController(
        IAdminService service)
    {
        _service = service;
    }

    [HttpPost("admins")]
    public async Task<IActionResult> CreateAdmin(
        CreateAdmissionOfficeRequest request)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!Guid.TryParse(userId, out var actorId))
            return Unauthorized();

        try
        {
            var result = await _service.CreateAdminAsync(
                request,
                actorId
            );

            return StatusCode(201, result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}