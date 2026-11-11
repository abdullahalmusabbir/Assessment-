using System.Net;
using System.Text.Json;

namespace backend.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (UnauthorizedAccessException ex)
        {
            await WriteErrorAsync(
                context,
                HttpStatusCode.Forbidden,
                "FORBIDDEN",
                ex.Message
            );
        }
        catch (KeyNotFoundException ex)
        {
            await WriteErrorAsync(
                context,
                HttpStatusCode.NotFound,
                "NOT_FOUND",
                ex.Message
            );
        }
        catch (ArgumentException ex)
        {
            await WriteErrorAsync(
                context,
                HttpStatusCode.BadRequest,
                "INVALID_ARGUMENT",
                ex.Message
            );
        }
        catch (InvalidOperationException ex)
        {
            await WriteErrorAsync(
                context,
                HttpStatusCode.Conflict,
                "BUSINESS_RULE_VIOLATION",
                ex.Message
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unhandled server error. TraceId: {TraceId}",
                context.TraceIdentifier
            );

            await WriteErrorAsync(
                context,
                HttpStatusCode.InternalServerError,
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred."
            );
        }
    }

    private static async Task WriteErrorAsync(
        HttpContext context,
        HttpStatusCode statusCode,
        string code,
        string message)
    {
        if (context.Response.HasStarted)
            return;

        context.Response.Clear();
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var response = new
        {
            success = false,
            error = new
            {
                code,
                message
            },
            traceId = context.TraceIdentifier
        };

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response)
        );
    }
}