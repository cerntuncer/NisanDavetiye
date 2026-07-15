using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NisanDavetiye.BLL.Options;
using NisanDavetiye.DAL.Repositories;

namespace NisanDavetiye.BLL.Services;

/// <summary>
/// Kuyruğa alınan galeri kayıtlarını Google Drive'a yükler, yerel dosyayı siler ve
/// DriveFileId'yi kaydeder. Ayrıca periyodik olarak eşik kontrolü yapar.
/// </summary>
public class DriveOffloadWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IDriveOffloadQueue _queue;
    private readonly IDriveStorageService _drive;
    private readonly IMediaUrlSigner _signer;
    private readonly GaleriStorageOptions _storage;
    private readonly DriveOffloadOptions _options;
    private readonly ILogger<DriveOffloadWorker> _logger;

    public DriveOffloadWorker(
        IServiceScopeFactory scopeFactory,
        IDriveOffloadQueue queue,
        IDriveStorageService drive,
        IMediaUrlSigner signer,
        IOptions<GaleriStorageOptions> storageOptions,
        IOptions<DriveOffloadOptions> offloadOptions,
        ILogger<DriveOffloadWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _queue = queue;
        _drive = drive;
        _signer = signer;
        _storage = storageOptions.Value;
        _options = offloadOptions.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_drive.IsConfigured)
        {
            _logger.LogInformation("Drive aktarımı kapalı veya yapılandırılmamış; worker beklemede.");
            return;
        }

        var monitor = RunThresholdMonitorAsync(stoppingToken);

        try
        {
            await foreach (var id in _queue.DequeueAllAsync(stoppingToken))
            {
                try
                {
                    await ProcessAsync(id, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Galeri #{Id} Drive'a aktarılamadı.", id);
                }
            }
        }
        catch (OperationCanceledException)
        {
            // kapanış
        }

        await monitor;
    }

    private async Task RunThresholdMonitorAsync(CancellationToken stoppingToken)
    {
        var interval = TimeSpan.FromMinutes(Math.Max(1, _options.CheckIntervalMinutes));

        // Başlangıçta bir kez kontrol et.
        await CheckThresholdSafeAsync(stoppingToken);

        using var timer = new PeriodicTimer(interval);
        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await CheckThresholdSafeAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException)
        {
            // kapanış
        }
    }

    private async Task CheckThresholdSafeAsync(CancellationToken stoppingToken)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var offload = scope.ServiceProvider.GetRequiredService<IDriveOffloadService>();
            var queued = await offload.EnqueuePendingIfOverThresholdAsync(stoppingToken);
            if (queued > 0)
                _logger.LogInformation("Eşik aşıldı; {Count} fotoğraf Drive kuyruğuna alındı.", queued);
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Drive eşik kontrolü başarısız.");
        }
    }

    private async Task ProcessAsync(int id, CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IDavetiyeRepository>();

        var item = await repo.GetGaleriResmiByIdAsync(id);
        if (item is null || !string.IsNullOrEmpty(item.DriveFileId))
            return;

        var fileName = _signer.TryGetFileName(item.Url);
        if (fileName is null)
            return;

        var diskPath = Path.Combine(_storage.AbsoluteUploadDirectory, fileName);
        if (!File.Exists(diskPath))
            return;

        var contentType = ContentTypeFromExtension(Path.GetExtension(fileName));
        var displayName = string.IsNullOrWhiteSpace(item.AltMetin) ? fileName : item.AltMetin;

        var fileId = await _drive.UploadAsync(diskPath, displayName, contentType, stoppingToken);
        await repo.SetGaleriDriveFileIdAsync(id, fileId);

        try
        {
            File.Delete(diskPath);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Drive'a aktarılan yerel dosya silinemedi: {File}", diskPath);
        }

        _logger.LogInformation("Galeri #{Id} Drive'a aktarıldı (fileId: {FileId}).", id, fileId);
    }

    private static string ContentTypeFromExtension(string ext) =>
        ext.ToLowerInvariant() switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            ".heic" => "image/heic",
            ".heif" => "image/heif",
            _ => "application/octet-stream",
        };
}
