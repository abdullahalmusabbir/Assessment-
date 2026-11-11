using backend.DTOs.Admission;
using backend.Models.Admission;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/classes")]
public class ClassesController : ControllerBase
{
    private readonly IAdmissionService _service;

    public ClassesController(IAdmissionService service)
    {
        _service = service;
    }

    // GET: api/classes
    [HttpGet]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetClassesAsync());
    }

    // POST: api/classes
    [HttpPost]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> CreateClass(
        CreateClassRequest request)
    {
        try
        {
            var result = await _service.CreateClassAsync(request);

            return StatusCode(
                StatusCodes.Status201Created,
                result
            );
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    // PUT: api/classes/{id}
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> UpdateClass(
        Guid id,
        UpdateClassRequest request)
    {
        try
        {
            var result = await _service.UpdateClassAsync(id, request);

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
    }

    // POST: api/classes/shifts
    [HttpPost("shifts")]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> CreateShift(
        CreateClassShiftRequest request)
    {
        try
        {
            var result = await _service.CreateClassShiftAsync(
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
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}