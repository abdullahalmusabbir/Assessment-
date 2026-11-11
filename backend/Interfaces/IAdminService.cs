using backend.DTOs.Admin;
using backend.Enums;

namespace backend.Interfaces;

public interface IAdminService
{
    Task<AdminUserResponse> CreateAdmissionOfficeAsync(
        CreateAdmissionOfficeRequest request,
        Guid createdByUserId
    );

    Task<AdminUserResponse> CreateAdminAsync(
        CreateAdmissionOfficeRequest request,
        Guid createdByUserId
    );

    Task<AdminUserResponse> CreateUserAsync(
        CreateUserRequest request,
        Guid createdByUserId
    );

    Task<List<AdminUserResponse>> GetUsersAsync(
        string? role,
        string? search
    );

    Task<AdminUserResponse> UpdateUserAsync(
        Guid userId,
        UpdateUserRequest request,
        Guid actorId
    );

    Task UpdateUserStatusAsync(
        Guid userId,
        UpdateUserStatusRequest request,
        Guid actorId
    );
}