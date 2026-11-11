using System.Security.Claims;
using backend.DTOs.Admission;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admission-circulars")]
public class AdmissionCircularsController : ControllerBase
{
    private readonly IAdmissionService _service;

    public AdmissionCircularsController(
        IAdmissionService service)
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

    // GET: api/admission-circulars
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublished()
    {
        var result = await _service.GetPublishedCircularsAsync();

        return Ok(result);
    }

    // POST: api/admission-circulars
    [HttpPost]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> Create(
        CreateCircularRequest request)
    {
        try
        {
            var result = await _service.CreateCircularAsync(
                request,
                CurrentUserId()
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
    }

    // PUT: api/admission-circulars/{id}
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateCircularRequest request)
    {
        try
        {
            var result = await _service.UpdateCircularAsync(
                id,
                request,
                CurrentUserId()
            );

            return Ok(result);
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

    // PATCH: api/admission-circulars/{id}/publish
    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> Publish(Guid id)
    {
        try
        {
            await _service.PublishCircularAsync(id);

            return Ok(new
            {
                message = "Admission circular published."
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