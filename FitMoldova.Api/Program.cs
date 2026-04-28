using System.Text;
using FitMoldova.BusinessLogic.Core;
using Microsoft.EntityFrameworkCore;
using FitMoldova.DataAccesLayer;
using FitMoldova.BusinessLogic.Mappings;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

FitMoldova.DataAccesLayer.DbSession.ConnectionString = 
     builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddControllers();
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

// ── Encryption service (SINGLETON — cheia se citește o dată) ──────────────
// Înregistrat ÎNAINTE de AddDbContext pentru că DbContext depinde de el.
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
               .AllowAnyMethod());
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

builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.UserAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.ActivityAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.ClubAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.EventAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.PostAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.RouteAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.ChallengeAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.ContactAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.FeedbackAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.GalleryAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Interfaces.IUserLogic, FitMoldova.BusinessLogic.Structure.UserLogic>();
     
var app = builder.Build();

var uploadsDir = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "gallery");
Directory.CreateDirectory(Path.Combine(uploadsDir, "thumbs"));

app.UseSwagger();
app.UseSwaggerUI();

// Adaugă coloane noi fără migrații EF — idempotent (IF NOT EXISTS)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FitMoldovaContext>();
    db.Database.ExecuteSqlRaw(@"
        ALTER TABLE ""Events"" ADD COLUMN IF NOT EXISTS ""ImageUrl"" VARCHAR(500) NOT NULL DEFAULT '';
    ");
}

app.UseCors("AllowFrontend");

// ── Security headers — protecție împotriva clickjacking și sniffing ──────────
app.Use(async (context, next) =>
{
    // Interzice includerea site-ului în iframe-uri (anti-clickjacking)
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    // Împiedică browserul să ghicească tipul fișierului (anti-sniffing)
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    // Activează filtrul XSS din browser
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    await next();
});

app.UseStaticFiles(new StaticFileOptions
{
     FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
          Path.Combine(app.Environment.ContentRootPath, "wwwroot")),
     RequestPath = ""
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
