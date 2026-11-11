
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth;

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
