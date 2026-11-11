using System.Security.Claims;
using backend.DTOs.Admin;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _service;

    public AdminController(IAdminService service)
    {
        _service = service;
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

    // POST: api/admin/admission-offices
    [HttpPost("admission-offices")]
    public async Task<IActionResult> CreateAdmissionOffice(
        CreateAdmissionOfficeRequest request)
    {
        try
        {
            var result = await _service.CreateAdmissionOfficeAsync(
                request,
                CurrentUserId()
            );

            return StatusCode(201, result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    // GET: api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? role,
        [FromQuery] string? search)
    {
        try
        {
            var result = await _service.GetUsersAsync(
                role,
                search
            );

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

        // POST: api/admin/users
    [HttpPost("users")]
    public async Task<IActionResult> CreateUser(
        CreateUserRequest request)
    {
        try
        {
            var result = await _service.CreateUserAsync(
                request,
                CurrentUserId()
            );

            return StatusCode(201, result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // PUT: api/admin/users/{id}
    [HttpPut("users/{id:guid}")]
    public async Task<IActionResult> UpdateUser(
        Guid id,
        UpdateUserRequest request)
    {
        try
        {
            var result = await _service.UpdateUserAsync(id, request, CurrentUserId());
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // PATCH: api/admin/users/{id}/status
    [HttpPatch("users/{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        UpdateUserStatusRequest request)
    {
        try
        {
            await _service.UpdateUserStatusAsync(
                id,
                request,
                CurrentUserId()
            );

            return Ok(new
            {
                message = "User status updated."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}