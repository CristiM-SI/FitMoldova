using System.Text;
using System.Threading.RateLimiting;
using FitMoldova.BusinessLogic.Core;
using FitMoldova.BusinessLogic.Interfaces;
using FitMoldova.BusinessLogic.Mappings;
using FitMoldova.BusinessLogic.Structure;
using FitMoldova.DataAccesLayer;
using FitMoldova.DataAccesLayer.Seeders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

DbSession.ConnectionString =
     builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddControllers();
builder.Services.AddSignalR();

var cloudinaryConfig = builder.Configuration.GetSection("Cloudinary");
var cloudinaryAccount = new CloudinaryDotNet.Account(
     cloudinaryConfig["CloudName"],
     cloudinaryConfig["ApiKey"],
     cloudinaryConfig["ApiSecret"]
);
var cloudinary = new CloudinaryDotNet.Cloudinary(cloudinaryAccount);
cloudinary.Api.Secure = true;
builder.Services.AddSingleton(cloudinary);
GalleryAction.CloudinaryInstance = cloudinary;
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
     c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
     {
          Description = "JWT Authorization header. Exemplu: Bearer eyJhbGci...",
          Name = "Authorization",
          In = Microsoft.OpenApi.Models.ParameterLocation.Header,
          Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
          Scheme = "Bearer"
     });

     c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
     {
          {
               new Microsoft.OpenApi.Models.OpenApiSecurityScheme
               {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                         Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                         Id = "Bearer"
                    }
               },
               new string[] {}
          }
     });
});

// ── Rate limiting ─────────────────────────────────────────────────────────
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth-limit", opt =>
    {
        opt.Window               = TimeSpan.FromMinutes(1);
        opt.PermitLimit          = 5;
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit           = 0;
    });

    options.AddPolicy("ContactFormPolicy", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit          = 5,
                Window               = TimeSpan.FromHours(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit           = 0
            }));

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            isSuccess = false,
            message   = "Prea multe cereri. Poți trimite maxim 5 mesaje pe oră."
        }, cancellationToken);
    };
});

// ── Encryption service (SINGLETON — cheia se citește o dată) ──────────────
builder.Services.AddSingleton<IEncryptionService, AesGcmEncryptionService>();

builder.Services.AddDbContext<FitMoldovaContext>(options =>
     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

builder.Services.AddCors(options =>
{
     options.AddPolicy("AllowFrontend", policy =>
          policy.WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://vite-frontend-danielus-hehes-projects.vercel.app",
                    "https://test2-ruby-two.vercel.app"
               )
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials());
});

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
     {
          options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
     })
     .AddJwtBearer(options =>
     {
          options.Events = new JwtBearerEvents
          {
               OnMessageReceived = context =>
               {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                         context.Token = accessToken;
                    return Task.CompletedTask;
               }
          };
          options.TokenValidationParameters = new TokenValidationParameters
          {
               ValidateIssuer = true,
               ValidateAudience = true,
               ValidateLifetime = true,
               ValidateIssuerSigningKey = true,
               ValidIssuer = jwtSettings["Issuer"],
               ValidAudience = jwtSettings["Audience"],
               IssuerSigningKey = new SymmetricSecurityKey(key),
               ClockSkew = TimeSpan.Zero
          };
     });

builder.Services.AddAuthorization();

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<RefreshTokenService>();
builder.Services.AddSingleton<DbSession>();

builder.Services.AddScoped<UserAction>();
builder.Services.AddScoped<ActivityAction>();
builder.Services.AddScoped<ClubAction>();
builder.Services.AddScoped<EventAction>();
builder.Services.AddScoped<PostAction>();
builder.Services.AddScoped<RouteAction>();
builder.Services.AddScoped<ChallengeAction>();
builder.Services.AddScoped<ContactAction>();
builder.Services.AddScoped<FeedbackAction>();
builder.Services.AddScoped<GalleryAction>();
builder.Services.AddScoped<IUserLogic, UserLogic>();

var app = builder.Build();

var uploadsDir = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "gallery");
Directory.CreateDirectory(Path.Combine(uploadsDir, "thumbs"));
Directory.CreateDirectory(Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "avatars"));

// ── Seed date inițiale (rulează o singură dată când baza de date e goală) ──
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FitMoldovaContext>();
    if (!context.Users.Any())
        InitialSeeder.Seed(context);
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

// ── Security headers ──────────────────────────────────────────────────────
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    await next();
});

app.UseStaticFiles(new StaticFileOptions
{
     FileProvider = new PhysicalFileProvider(
          Path.Combine(app.Environment.ContentRootPath, "wwwroot")),
     RequestPath = ""
});

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHub<ChatHub>("/hubs/chat");
app.Run();