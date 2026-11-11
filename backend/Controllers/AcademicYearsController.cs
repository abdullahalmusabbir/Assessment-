using backend.DTOs.Admission;
using backend.DTOs.Admin;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/academic-years")]
[Authorize(Roles = "Admin,AdmissionOffice")]
public class AcademicYearsController : ControllerBase
{
    private readonly IAdmissionService _service;

    public AcademicYearsController(IAdmissionService service)
    {
        _service = service;
    }

    // GET: api/academic-years
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAcademicYearsAsync());
    }

    // POST: api/academic-years
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateAcademicYearRequest request)
    {
        try
        {
            var result = await _service.CreateAcademicYearAsync(request);
            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = ex.Message });
        }
    }

    // PUT: api/academic-years/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateAcademicYearRequest request)
    {
        try
        {
            var result = await _service.UpdateAcademicYearAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = ex.Message });
        }
    }

    // PATCH: api/academic-years/{id}/admission-status
    [HttpPatch("{id:guid}/admission-status")]
    public async Task<IActionResult> SetAdmissionStatus(
        Guid id,
        [FromQuery] bool isOpen)
    {
        try
        {
            await _service.SetAdmissionStatusAsync(id, isOpen);
            return Ok(new
            {
                message = isOpen ? "Admission opened." : "Admission closed."
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}