using Commentator.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddLogging();
builder.Services.AddScoped<IYouTubeService, YouTubeService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextApp",
        builder => builder
            .WithOrigins("http://localhost:3001")
            .AllowAnyMethod()
            .AllowAnyHeader());

    options.AddPolicy("AllowNextAppProd",
        builder => builder
            .WithOrigins("https://commentatorai.vercel.app")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowNextAppProd");
    app.MapOpenApi();
}
else
{
    app.UseCors("AllowNextAppProd");
}

app.MapGet("Testing", (HttpContext context) =>
{
    return Results.Ok("Hi");
});
app.UseCors("AllowNextAppProd");

app.UseHttpsRedirection();
app.MapControllers();

app.Run();