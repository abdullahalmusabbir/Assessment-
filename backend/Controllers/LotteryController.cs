using System.Security.Claims;
using backend.DTOs.Lottery;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/lottery")]
public class LotteryController : ControllerBase
{
    private readonly ILotteryService _service;

    public LotteryController(ILotteryService service)
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

    // GET: api/lottery
    [HttpGet]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetLotteryDrawsAsync());
    }

    // POST: api/lottery/run
    [HttpPost("run")]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> Run(
        RunLotteryRequest request)
    {
        try
        {
            var result = await _service.RunLotteryAsync(
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

    // PATCH: api/lottery/{id}/publish
    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = "Admin,AdmissionOffice")]
    public async Task<IActionResult> Publish(Guid id)
    {
        try
        {
            await _service.PublishLotteryResultAsync(id);

            return Ok(new
            {
                message = "Lottery result published."
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

    // GET: api/lottery/results?circularId=...&shiftId=...
    [HttpGet("results")]
    [Authorize(Roles = "Student,Admin,AdmissionOffice")]
    public async Task<IActionResult> GetResults(
        [FromQuery] Guid circularId,
        [FromQuery] Guid shiftId)
    {
        try
        {
            var result = await _service.GetPublishedResultAsync(
                circularId,
                shiftId
            );

            if (User.IsInRole("Student"))
            {
                var userId = CurrentUserId();
                result = result
                    .Where(x => x.StudentId != Guid.Empty)
                    .ToList();
            }

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}