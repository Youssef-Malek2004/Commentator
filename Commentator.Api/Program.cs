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
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowNextApp");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();