using backend.Data;
using backend.DTOs.Admin;
using backend.Enums;
using backend.Interfaces;
using backend.Models.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdminUserResponse> CreateAdmissionOfficeAsync(
        CreateAdmissionOfficeRequest request,
        Guid createdByUserId)
    {
        return await CreateStaffAsync(
            request,
            createdByUserId,
            UserRole.AdmissionOffice
        );
    }

    public async Task<AdminUserResponse> CreateAdminAsync(
        CreateAdmissionOfficeRequest request,
        Guid createdByUserId)
    {
        var actor = await _context.Users
            .Include(x => x.AdmissionOfficeProfile)
            .FirstOrDefaultAsync(x =>
                x.Id == createdByUserId &&
                !x.IsDeleted
            );

        if (actor == null)
            throw new UnauthorizedAccessException("User not found.");

        var isAdmin = actor.Role == UserRole.Admin;

        var isAuthorizedAdmissionOffice =
            actor.Role == UserRole.AdmissionOffice &&
            actor.AdmissionOfficeProfile != null &&
            actor.AdmissionOfficeProfile.IsApproved &&
            actor.AdmissionOfficeProfile.CanCreateAdmin;

        if (!isAdmin && !isAuthorizedAdmissionOffice)
            throw new UnauthorizedAccessException(
                "You are not allowed to create Admin accounts."
            );

        return await CreateStaffAsync(
            request,
            createdByUserId,
            UserRole.Admin
        );
    }

    public async Task<AdminUserResponse> CreateUserAsync(
        CreateUserRequest request,
        Guid createdByUserId)
    {
        var actor = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Id == createdByUserId &&
                !x.IsDeleted
            );

        if (actor == null || actor.Role != UserRole.Admin)
            throw new UnauthorizedAccessException("Only admins can create users.");

        if (!Enum.TryParse<UserRole>(request.Role, true, out var parsedRole))
            throw new ArgumentException("Invalid user role.");

        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.Users
            .AnyAsync(x => x.Email.ToLower() == email);

        if (emailExists)
            throw new InvalidOperationException(
                "Email address is already registered."
            );

        var password = !string.IsNullOrWhiteSpace(request.Password)
            ? request.Password
            : Guid.NewGuid().ToString("N")[..12];

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = parsedRole,
            Status = UserStatus.Active,
            IsGoogleAccount = false,
            MustChangePassword = string.IsNullOrWhiteSpace(request.Password),
            CreatedBy = createdByUserId.ToString(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return new AdminUserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString(),
            Status = user.Status,
            CreatedAt = user.CreatedAt,
            EmployeeId = user.AdmissionOfficeProfile?.EmployeeId
        };
    }

    private async Task<AdminUserResponse> CreateStaffAsync(
        CreateAdmissionOfficeRequest request,
        Guid createdByUserId,
        UserRole role)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.Users
            .AnyAsync(x => x.Email.ToLower() == email);

        if (emailExists)
            throw new InvalidOperationException(
                "Email address is already registered."
            );

        if (role == UserRole.AdmissionOffice)
        {
            var employeeExists = await _context.AdmissionOfficeProfiles
                .AnyAsync(x => x.EmployeeId == request.EmployeeId);

            if (employeeExists)
                throw new InvalidOperationException(
                    "Employee ID already exists."
                );
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                request.Password
            ),
            Role = role,
            Status = UserStatus.Active,
            IsGoogleAccount = false,
            MustChangePassword = false,
            CreatedBy = createdByUserId.ToString(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        if (role == UserRole.AdmissionOffice)
        {
            var profile = new AdmissionOfficeProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                EmployeeId = request.EmployeeId.Trim(),
                Department = request.Department,
                Designation = request.Designation,
                JoiningDate = DateTime.UtcNow,
                CanCreateAdmin = request.CanCreateAdmin,
                CanManageCirculars = request.CanManageCirculars,
                CanManageAdmissions = request.CanManageAdmissions,
                IsApproved = true
            };

            _context.AdmissionOfficeProfiles.Add(profile);
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return new AdminUserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString(),
            Status = user.Status,
            CreatedAt = user.CreatedAt,
            EmployeeId = role == UserRole.AdmissionOffice
                ? request.EmployeeId
                : null
        };
    }

    public async Task<List<AdminUserResponse>> GetUsersAsync(
        string? role,
        string? search)
    {
        var query = _context.Users
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(role))
        {
            if (!Enum.TryParse<UserRole>(
                role,
                true,
                out var parsedRole))
            {
                throw new ArgumentException("Invalid user role.");
            }

            query = query.Where(x => x.Role == parsedRole);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();

            query = query.Where(x =>
                x.Email.ToLower().Contains(term) ||
                x.FirstName.ToLower().Contains(term) ||
                x.LastName.ToLower().Contains(term)
            );
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new AdminUserResponse
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                Role = x.Role.ToString(),
                Status = x.Status,
                CreatedAt = x.CreatedAt,
                EmployeeId = x.AdmissionOfficeProfile != null
                    ? x.AdmissionOfficeProfile.EmployeeId
                    : null
            })
            .ToListAsync();
    }

    public async Task<AdminUserResponse> UpdateUserAsync(
        Guid userId,
        UpdateUserRequest request,
        Guid actorId)
    {
        var actor = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == actorId && !x.IsDeleted);

        if (actor == null || actor.Role != UserRole.Admin)
            throw new UnauthorizedAccessException("Only admins can update users.");

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (!string.IsNullOrWhiteSpace(request.FirstName))
            user.FirstName = request.FirstName.Trim();
        if (!string.IsNullOrWhiteSpace(request.LastName))
            user.LastName = request.LastName.Trim();
        if (!string.IsNullOrWhiteSpace(request.Email))
            user.Email = request.Email.Trim().ToLowerInvariant();
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            user.PhoneNumber = request.PhoneNumber;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.MustChangePassword = false;
        }

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            if (!Enum.TryParse<UserRole>(request.Role, true, out var parsedRole))
                throw new ArgumentException("Invalid user role.");
            user.Role = parsedRole;
        }

        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = actorId.ToString();

        await _context.SaveChangesAsync();

        return new AdminUserResponse
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role.ToString(),
            Status = user.Status,
            CreatedAt = user.CreatedAt,
            EmployeeId = user.AdmissionOfficeProfile?.EmployeeId
        };
    }

    public async Task UpdateUserStatusAsync(
        Guid userId,
        UpdateUserStatusRequest request,
        Guid actorId)
    {
        if (userId == actorId)
            throw new InvalidOperationException(
                "You cannot change your own account status."
            );

        var user = await _context.Users
            .FirstOrDefaultAsync(x =>
                x.Id == userId &&
                !x.IsDeleted
            );

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (user.Role == UserRole.Admin &&
            request.Status == UserStatus.Suspended)
        {
            var activeAdmins = await _context.Users
                .CountAsync(x =>
                    x.Role == UserRole.Admin &&
                    x.Status == UserStatus.Active &&
                    !x.IsDeleted
                );

            if (activeAdmins <= 1)
                throw new InvalidOperationException(
                    "The last active Admin cannot be suspended."
                );
        }

        user.Status = request.Status;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = actorId.ToString();

        await _context.SaveChangesAsync();
    }
}