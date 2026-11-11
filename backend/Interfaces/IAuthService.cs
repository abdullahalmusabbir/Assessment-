
using backend.DTOs.Auth;

namespace backend.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(
        RegisterRequest request,
        string? ipAddress
    );

    Task<AuthResponse> LoginAsync(
        LoginRequest request,
        string? ipAddress
    );

    Task<AuthResponse> RefreshTokenAsync(
        string refreshToken,
        string? ipAddress
    );

    Task LogoutAsync(
        Guid userId,
        string refreshToken,
        string? ipAddress
    );

    Task ForgotPasswordAsync(
        string email
    );

    Task ResetPasswordAsync(
        ResetPasswordRequest request
    );

    Task<AuthResponse> GoogleLoginAsync(
        string idToken,
        string? ipAddress
    );

    Task<UserResponse> GetCurrentUserAsync(
        Guid userId
    );
}
