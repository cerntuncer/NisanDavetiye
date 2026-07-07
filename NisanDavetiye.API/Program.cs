using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using NisanDavetiye.API.Middleware;
using NisanDavetiye.BLL;
using NisanDavetiye.BLL.Options;
using NisanDavetiye.DAL;
using NisanDavetiye.DAL.Data;
using NisanDavetiye.DAL.Repositories;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? "Data Source=nisandavetiye.db";

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddDal(connectionString);
builder.Services.AddBll(builder.Configuration);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("public-forms", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 20,
                QueueLimit = 0
            }));
});

var galeriUploadRelative = builder.Configuration["GaleriStorage:UploadDirectory"] ?? "uploads/galeri";
var galeriPublicPrefix = builder.Configuration["GaleriStorage:PublicUrlPrefix"] ?? "/uploads/galeri";
var galeriAbsolutePath = Path.IsPathRooted(galeriUploadRelative)
    ? galeriUploadRelative
    : Path.Combine(builder.Environment.ContentRootPath, galeriUploadRelative);

builder.Services.Configure<GaleriStorageOptions>(options =>
{
    options.UploadDirectory = galeriUploadRelative;
    options.PublicUrlPrefix = galeriPublicPrefix;
    options.AbsoluteUploadDirectory = galeriAbsolutePath;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("UiPolicy", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:4173",
                "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

var galeriStorage = app.Services.GetRequiredService<Microsoft.Extensions.Options.IOptions<GaleriStorageOptions>>().Value;
Directory.CreateDirectory(galeriStorage.AbsoluteUploadDirectory);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NisanDavetiyeDbContext>();
    var davetiyeRepo = scope.ServiceProvider.GetRequiredService<IDavetiyeRepository>();
    db.Database.Migrate();
    await EnsureRsvpSchemaAsync(db);
    await EnsureDavetUidSchemaAsync(db);
    await davetiyeRepo.EnsureDavetUidAsync();
    await DavetiyeDataSeeder.SeedAsync(db);
}

app.UseCors("UiPolicy");
app.UseRateLimiter();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(galeriStorage.AbsoluteUploadDirectory),
    RequestPath = galeriStorage.PublicUrlPrefix.TrimEnd('/'),
});
app.UseSecurity();
app.MapControllers();

app.Run();

static async Task EnsureRsvpSchemaAsync(NisanDavetiyeDbContext db)
{
    await using var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
        await connection.OpenAsync();

    await using var check = connection.CreateCommand();
    check.CommandText = """
        SELECT COUNT(*)
        FROM pragma_table_info('RsvpKayitlari')
        WHERE name = 'AdminListedenGizli'
        """;
    var exists = Convert.ToInt64(await check.ExecuteScalarAsync() ?? 0L) > 0;
    if (exists)
        return;

    await using var alter = connection.CreateCommand();
    alter.CommandText = """
        ALTER TABLE RsvpKayitlari
        ADD COLUMN AdminListedenGizli INTEGER NOT NULL DEFAULT 0
        """;
    await alter.ExecuteNonQueryAsync();
}

static async Task EnsureDavetUidSchemaAsync(NisanDavetiyeDbContext db)
{
    await using var connection = db.Database.GetDbConnection();
    if (connection.State != System.Data.ConnectionState.Open)
        await connection.OpenAsync();

    await using var check = connection.CreateCommand();
    check.CommandText = """
        SELECT COUNT(*)
        FROM pragma_table_info('DavetiyeAyarlari')
        WHERE name = 'DavetUid'
        """;
    var exists = Convert.ToInt64(await check.ExecuteScalarAsync() ?? 0L) > 0;
    if (exists)
        return;

    await using var alter = connection.CreateCommand();
    alter.CommandText = """
        ALTER TABLE DavetiyeAyarlari
        ADD COLUMN DavetUid TEXT NOT NULL DEFAULT ''
        """;
    await alter.ExecuteNonQueryAsync();
}
