using Commentator.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IYouTubeService, YouTubeService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextApp",
        builder => builder
            .WithOrigins("http://localhost:3002")
            .AllowAnyMethod()
            .AllowAnyHeader());
    
    options.AddPolicy("AllowNextAppProd",
        builder => builder
            .WithOrigins("https://commentatorai.vercel.app")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

app.MapGet("testing", (HttpContext context) =>
{
    return Results.Ok("hi");
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowNextAppProd");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();