using Microsoft.Extensions.Caching.Distributed;

public class RateLimiter {
    private readonly RequestDelegate _next;
    private readonly IDistributedCache _cache;
    private readonly ILogger<RateLimiter> _logger;

    public RateLimiter(RequestDelegate next, IDistributedCache cache, ILogger<RateLimiter> logger) {
        _next = next;
        _cache = cache;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context) {
        var endpoint = context.GetEndpoint();
        var clientId = context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString();
        var key = $"rate_limit_{clientId}_{endpoint}";

        // Get the raw byte array from cache
        var data = await _cache.GetAsync(key);
        var requestCount = data != null ? BitConverter.ToInt32(data, 0) : 0;
        
        if (requestCount >= 100) // 100 requests per minute
        {
            context.Response.StatusCode = 429; // Too Many Requests
            return;
        }

        await _next(context);
    }
}