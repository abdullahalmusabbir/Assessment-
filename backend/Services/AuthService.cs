
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Data;
using backend.DTOs.Auth;
using backend.Enums;
using backend.Interfaces;
using backend.Models.Identity;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public AuthService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IEmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    // =========================================
    // REGISTER STUDENT
    // =========================================

    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request,
        string? ipAddress)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _context.Users
            .AnyAsync(x => x.Email.ToLower() == email);

        if (existingUser)
            throw new InvalidOperationException("Email is already registered.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PhoneNumber = request.PhoneNumber?.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Student,
            Status = UserStatus.Active,
            IsGoogleAccount = false,
            PasswordChangedAt = DateTime.UtcNow
        };

        var studentProfile = new StudentProfile
        {
            UserId = user.Id
        };

        user.StudentProfile = studentProfile;

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return await CreateAuthResponseAsync(user, ipAddress);
    }

    // =========================================
    // LOGIN
    // =========================================

    public async Task<AuthResponse> LoginAsync(
        LoginRequest request,
        string? ipAddress)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        if (user.Status != UserStatus.Active)
            throw new UnauthorizedAccessException("Your account is not active.");

        if (user.LockoutEnd.HasValue &&
            user.LockoutEnd.Value > DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException(
                "Account temporarily locked. Please try again later."
            );
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            user.FailedLoginAttempts++;

            if (user.FailedLoginAttempts >= 5)
            {
                user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                user.FailedLoginAttempts = 0;
            }

            await _context.SaveChangesAsync();

            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
        user.LastLoginAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await CreateAuthResponseAsync(user, ipAddress);
    }

    // =========================================
    // REFRESH TOKEN
    // =========================================

    public async Task<AuthResponse> RefreshTokenAsync(
        string refreshToken,
        string? ipAddress)
    {
        var tokenHash = HashToken(refreshToken);

        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable
            );

        var storedToken = await _context.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash);

        if (storedToken == null ||
            storedToken.RevokedAt != null ||
            storedToken.ExpiresAt <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException(
                "Invalid or expired refresh token."
            );
        }

        var user = storedToken.User;

        if (user == null || user.Status != UserStatus.Active)
        {
            throw new UnauthorizedAccessException("Account is not active.");
        }

        // Revoke the old refresh token.
        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;

        // Create a new token pair.
        var response = await CreateAuthResponseAsync(user, ipAddress);

        storedToken.ReplacedByTokenHash = HashToken(response.RefreshToken);

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return response;
    }

    // =========================================
    // LOGOUT
    // =========================================

    public async Task LogoutAsync(
        Guid userId,
        string refreshToken,
        string? ipAddress)
    {
        var tokenHash = HashToken(refreshToken);

        var storedToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(x =>
                x.TokenHash == tokenHash &&
                x.UserId == userId
            );

        if (storedToken == null || storedToken.RevokedAt != null)
            return;

        storedToken.RevokedAt = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;

        await _context.SaveChangesAsync();
    }

    // =========================================
    // FORGOT PASSWORD
    // =========================================

    public async Task ForgotPasswordAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Email.ToLower() == normalizedEmail
            );

        // Do not reveal whether an email exists.
        if (user == null || user.Status != UserStatus.Active)
            return;

        var rawToken = GenerateSecureToken();

        var tokenHash = HashToken(rawToken);

        // Invalidate previous unused reset tokens.
        var previousTokens = await _context.PasswordResetTokens
            .Where(x =>
                x.UserId == user.Id &&
                x.UsedAt == null
            )
            .ToListAsync();

        foreach (var oldToken in previousTokens)
        {
            oldToken.UsedAt = DateTime.UtcNow;
        }

        var resetToken = new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            RequestIp = null
        };

        _context.PasswordResetTokens.Add(resetToken);

        await _context.SaveChangesAsync();

        var frontendUrl = _configuration["Frontend:BaseUrl"]
            ?? throw new InvalidOperationException(
                "Frontend BaseUrl is missing."
            );

        var resetLink =
            $"{frontendUrl.TrimEnd('/')}/reset-password?token={Uri.EscapeDataString(rawToken)}";

        await _emailService.SendPasswordResetEmailAsync(
            user.Email,
            user.FirstName,
            resetLink
        );
    }

    // =========================================
    // RESET PASSWORD
    // =========================================

    public async Task ResetPasswordAsync(
        ResetPasswordRequest request)
    {
        var tokenHash = HashToken(request.Token);

        var resetToken = await _context.PasswordResetTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash);

        if (resetToken == null ||
            resetToken.UsedAt != null ||
            resetToken.ExpiresAt <= DateTime.UtcNow)
        {
            throw new InvalidOperationException(
                "Invalid or expired password reset token."
            );
        }

        var user = resetToken.User;

        if (user == null || user.Status != UserStatus.Active)
        {
            throw new InvalidOperationException("User account is not active.");
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(
            request.NewPassword
        );

        user.PasswordChangedAt = DateTime.UtcNow;

        resetToken.UsedAt = DateTime.UtcNow;

        // Revoke all existing refresh tokens after password reset.
        var refreshTokens = await _context.RefreshTokens
            .Where(x =>
                x.UserId == user.Id &&
                x.RevokedAt == null
            )
            .ToListAsync();

        foreach (var token in refreshTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();
    }

    // =========================================
    // GOOGLE LOGIN
    // =========================================

    public async Task<AuthResponse> GoogleLoginAsync(
        string idToken,
        string? ipAddress)
    {
        var clientId = _configuration["Google:ClientId"];

        if (string.IsNullOrWhiteSpace(clientId))
            throw new InvalidOperationException(
                "Google ClientId is not configured."
            );

        GoogleJsonWebSignature.Payload payload;

        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(
                idToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                }
            );
        }
        catch
        {
            throw new UnauthorizedAccessException(
                "Invalid Google ID token."
            );
        }

        if (string.IsNullOrWhiteSpace(payload.Email) ||
            !payload.EmailVerified)
        {
            throw new UnauthorizedAccessException(
                "Google email is not verified."
            );
        }

        var email = payload.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email);

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = payload.GivenName ?? "Google",
                LastName = payload.FamilyName ?? "User",
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                    Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
                ),
                Role = UserRole.Student,
                Status = UserStatus.Active,
                IsGoogleAccount = true,
                ProfileImageUrl = payload.Picture
            };

            user.StudentProfile = new StudentProfile
            {
                UserId = user.Id
            };

            _context.Users.Add(user);
        }
        else
        {
            if (user.Status != UserStatus.Active)
                throw new UnauthorizedAccessException(
                    "Your account is not active."
                );

            // Existing staff accounts retain their assigned roles.
            user.ProfileImageUrl ??= payload.Picture;
        }

        user.LastLoginAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await CreateAuthResponseAsync(user, ipAddress);
    }

    // =========================================
    // CURRENT USER
    // =========================================

    public async Task<UserResponse> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        return MapUser(user);
    }

    // =========================================
    // CREATE ACCESS + REFRESH TOKEN
    // =========================================

    private async Task<AuthResponse> CreateAuthResponseAsync(
        User user,
        string? ipAddress)
    {
        var now = DateTime.UtcNow;

        var jwtSettings = _configuration.GetSection("Jwt");

        var secretKey = jwtSettings["SecretKey"]
            ?? throw new InvalidOperationException(
                "JWT SecretKey is missing."
            );

        var issuer = jwtSettings["Issuer"]
            ?? throw new InvalidOperationException(
                "JWT Issuer is missing."
            );

        var audience = jwtSettings["Audience"]
            ?? throw new InvalidOperationException(
                "JWT Audience is missing."
            );

        var accessMinutes =
            jwtSettings.GetValue<int>("AccessTokenExpiryMinutes");

        var refreshDays =
            jwtSettings.GetValue<int>("RefreshTokenExpiryDays");

        if (accessMinutes <= 0 || refreshDays <= 0)
            throw new InvalidOperationException(
                "JWT expiry settings must be greater than zero."
            );

        var accessExpiresAt = now.AddMinutes(accessMinutes);

        var refreshExpiresAt = now.AddDays(refreshDays);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var jwt = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: now,
            expires: accessExpiresAt,
            signingCredentials: credentials
        );

        var accessToken = new JwtSecurityTokenHandler()
            .WriteToken(jwt);

        var refreshToken = GenerateSecureToken();

        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = HashToken(refreshToken),
            ExpiresAt = refreshExpiresAt,
            CreatedByIp = ipAddress,
            DeviceName = null
        };

        _context.RefreshTokens.Add(refreshTokenEntity);

        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt = accessExpiresAt,
            RefreshTokenExpiresAt = refreshExpiresAt,
            User = MapUser(user)
        };
    }

    // =========================================
    // MAP USER RESPONSE
    // =========================================

    private static UserResponse MapUser(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString(),
            Status = user.Status.ToString(),
            IsGoogleAccount = user.IsGoogleAccount
        };
    }

    // =========================================
    // TOKEN HELPERS
    // =========================================

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);

        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(
            Encoding.UTF8.GetBytes(token)
        );

        return Convert.ToHexString(bytes);
    }
}
