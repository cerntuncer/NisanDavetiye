using NisanDavetiye.BLL.Security;
using NisanDavetiye.BLL.Services;

namespace NisanDavetiye.API.Middleware;

public class SecurityMiddleware
{
    public const string DavetKeyHeader = "X-Davet-Key";
    public const string AdminKeyHeader = "X-Admin-Key";

    private readonly RequestDelegate _next;
    private readonly IConfiguration _config;

    public SecurityMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _config = config;
    }

    public async Task InvokeAsync(HttpContext context, IInviteAuthService inviteAuth)
    {
        var path = context.Request.Path.Value ?? string.Empty;
        var method = context.Request.Method;

        if (IsAdminRoute(path, method))
        {
            if (!IsValidAdminKey(context))
            {
                await WriteUnauthorizedAsync(context);
                return;
            }
        }
        else if (RequiresDavetKey(path, method))
        {
            var provided = context.Request.Headers[DavetKeyHeader].FirstOrDefault();
            if (!await inviteAuth.IsValidDavetKeyAsync(provided))
            {
                await WriteForbiddenAsync(context);
                return;
            }
        }

        await _next(context);
    }

    private static bool RequiresDavetKey(string path, string method) =>
        (path.Equals("/api/rsvp", StringComparison.OrdinalIgnoreCase) && method == "POST")
        || (path.Equals("/api/galeri/upload", StringComparison.OrdinalIgnoreCase) && method == "POST");

    private static bool IsAdminRoute(string path, string method)
    {
        if (path.StartsWith("/api/admin/galeri", StringComparison.OrdinalIgnoreCase))
            return true;

        if (path.Equals("/api/davetiye", StringComparison.OrdinalIgnoreCase))
            return method is "GET" or "PUT";

        return path.StartsWith("/api/rsvp", StringComparison.OrdinalIgnoreCase) && method is not "POST";
    }

    private bool IsValidAdminKey(HttpContext context)
    {
        var expected = _config["Admin:ApiKey"];
        var provided = context.Request.Headers[AdminKeyHeader].FirstOrDefault();
        return SecureCompare.Equals(expected, provided);
    }

    private static async Task WriteUnauthorizedAsync(HttpContext context)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsJsonAsync(new { message = "Yetkisiz erişim." });
    }

    private static async Task WriteForbiddenAsync(HttpContext context)
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        await context.Response.WriteAsJsonAsync(new { message = "Geçersiz davetiye bağlantısı." });
    }
}

public static class SecurityMiddlewareExtensions
{
    public static IApplicationBuilder UseSecurity(this IApplicationBuilder app) =>
        app.UseMiddleware<SecurityMiddleware>();
}
