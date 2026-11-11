using System.ComponentModel.DataAnnotations;
using backend.Enums;

namespace backend.DTOs.Admin;

public class UpdateUserStatusRequest
{
    [Required]
    public UserStatus Status { get; set; }
}