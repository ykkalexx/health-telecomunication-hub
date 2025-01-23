using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Server.core.interfaces;
using Server.infrastructure;
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
        builder
            .WithOrigins("http://localhost:5173") // Your frontend URL
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // Required for SignalR
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

// Add SignalR
builder.Services.AddSignalR();


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

        // Configure for SignalR
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && 
                    (path.StartsWithSegments("/healthHub") || 
                     path.StartsWithSegments("/medicineHub") || 
                     path.StartsWithSegments("/goalHub")))
                {
                    context.Token = accessToken;
                }
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

app.MapHub<HealthHub>("/healthHub");
app.MapHub<MedicineHub>("/medicineHub");
app.MapHub<GoalHub>("/goalHub");

app.Run();