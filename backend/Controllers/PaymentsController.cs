using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.DTOs.Admission;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IConfiguration _configuration;

    public PaymentsController(
        IPaymentService paymentService,
        IConfiguration configuration)
    {
        _paymentService = paymentService;
        _configuration = configuration;
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

    // POST: api/payments
    [Authorize(Roles = "Student")]
    [HttpPost]
    public async Task<IActionResult> CreatePayment(
        CreatePaymentRequest request)
    {
        try
        {
            var result = await _paymentService.CreatePaymentAsync(
                CurrentUserId(),
                request
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
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }

    // GET: api/payments/{id}
    [Authorize(Roles = "Student")]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPayment(Guid id)
    {
        var result = await _paymentService.GetPaymentAsync(
            CurrentUserId(),
            id
        );

        if (result == null)
            return NotFound(new { message = "Payment not found." });

        return Ok(result);
    }

    // POST: api/payments/webhook
    [AllowAnonymous]
    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook(
        PaymentWebhookRequest request)
    {
        var expectedSecret = _configuration[
            "Payment:WebhookSecret"
        ];

        var receivedSecret = Request.Headers[
            "X-Payment-Webhook-Secret"
        ].ToString();

        if (string.IsNullOrWhiteSpace(expectedSecret) ||
            string.IsNullOrWhiteSpace(receivedSecret))
        {
            return Unauthorized();
        }

        var expectedBytes = Encoding.UTF8.GetBytes(expectedSecret);
        var receivedBytes = Encoding.UTF8.GetBytes(receivedSecret);

        if (expectedBytes.Length != receivedBytes.Length ||
            !CryptographicOperations.FixedTimeEquals(
                expectedBytes,
                receivedBytes
            ))
        {
            return Unauthorized();
        }

        try
        {
            await _paymentService.ConfirmPaymentAsync(
                request.TransactionId,
                request.GatewayReference,
                request.GatewayResponse
            );

            return Ok(new
            {
                message = "Payment callback processed."
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