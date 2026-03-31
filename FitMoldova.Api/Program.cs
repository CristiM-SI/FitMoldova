var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
     options.AddPolicy("AllowFrontend", policy =>
          policy.WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://vite-frontend-danielus-hehes-projects.vercel.app/"  // ← pune URL-ul tău real aici
               )
               .AllowAnyHeader()
               .AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();
app.Run();