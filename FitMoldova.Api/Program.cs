using System.Text;
using FitMoldova.BusinessLogic.Core;
using Microsoft.EntityFrameworkCore;
using FitMoldova.DataAccesLayer;
using FitMoldova.BusinessLogic.Mappings;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

FitMoldova.DataAccesLayer.DbSession.ConnectionString = 
     builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
builder.Services.AddSingleton<DbSession>();

builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.UserAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.ActivityAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.ClubAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.EventAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.PostAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.RouteAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Core.ChallengeAction>();
builder.Services.AddScoped<FitMoldova.BusinessLogic.Interfaces.IUserLogic, FitMoldova.BusinessLogic.Structure.UserLogic>();
     
var app = builder.Build();

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

// FIX BUG CRITIC: UseAuthentication TREBUIE să fie înainte de UseAuthorization.
// În codul original lipsea complet, deci [Authorize] nu funcționa.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
