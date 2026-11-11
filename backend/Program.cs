using backend.Data;
using backend.Extensions;
using backend.Interfaces;
using backend.Services;
using backend.Middleware;
using backend.BackgroundServices;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =========================================
// CONTROLLERS
// =========================================
builder.Services.AddControllers();

// =========================================
// POSTGRESQL
// =========================================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// =========================================
// JWT AUTHENTICATION
// =========================================
builder.Services.AddJwtAuthentication(builder.Configuration);

// =========================================
// CORS
// =========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("NextJsPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =========================================
// SWAGGER
// =========================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================================
// APPLICATION SERVICES
// =========================================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdmissionService, AdmissionService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ILotteryService, LotteryService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportService, ReportService>();

// =========================================
// BACKGROUND SERVICES
// =========================================
builder.Services.AddHostedService<AdmissionHoldExpiryService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global exception middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseCors("NextJsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
