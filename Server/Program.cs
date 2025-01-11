using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Server.core.interfaces;
using Server.infrastructure.data;
using Server.infrastructure.services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// allow cors
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", builder => {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// Configure MongoDB
var mongoClinet = new MongoClient(builder.Configuration.GetConnectionString("MongoDB"));
var database = mongoClinet.GetDatabase("HealthTracker");
builder.Services.AddSingleton<IMongoDatabase>(database);

// Register services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IHealthService, HealthServices>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IMedicineService, MedicineService>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddHostedService<NotificationBackgroundService>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };

        // Add JWT events for debugging
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogInformation("Token validated successfully");
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

// Add logging middleware for debuggin

var app = builder.Build();

app.Use(async (context, next) => {
    var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
    if (authHeader != null)
    {
        var token = authHeader.StartsWith("Bearer ") 
            ? authHeader.Substring(7) 
            : authHeader;
            
        Console.WriteLine($"Auth header: {authHeader}");
        Console.WriteLine($"Extracted token: {token.Substring(0, 20)}...");
    }
    await next();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();