
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace backend.Extensions;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");

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

        if (Encoding.UTF8.GetByteCount(secretKey) < 32)
        {
            throw new InvalidOperationException(
                "JWT SecretKey must contain at least 32 bytes."
            );
        }

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                    JwtBearerDefaults.AuthenticationScheme;

                options.DefaultChallengeScheme =
                    JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true;

                options.SaveToken = false;

                options.TokenValidationParameters =
                    new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = issuer,

                        ValidateAudience = true,
                        ValidAudience = audience,

                        ValidateIssuerSigningKey = true,

                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(secretKey)
                        ),

                        ValidateLifetime = true,

                        ClockSkew = TimeSpan.FromSeconds(30),

                        NameClaimType =
                            System.Security.Claims.ClaimTypes.Name,

                        RoleClaimType =
                            System.Security.Claims.ClaimTypes.Role
                    };
            });

        services.AddAuthorization();

        return services;
    }
}
