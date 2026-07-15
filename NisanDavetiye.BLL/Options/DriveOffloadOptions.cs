namespace NisanDavetiye.BLL.Options;

public class DriveOffloadOptions
{
    public const string SectionName = "DriveOffload";

    /// <summary>Özellik açık mı? Kapalıysa hiçbir aktarım yapılmaz.</summary>
    public bool Enabled { get; set; }

    /// <summary>Yerel galeri klasörü bu boyutu (MB) aşınca tüm bekleyen dosyalar kuyruğa alınır.</summary>
    public int ThresholdMegabytes { get; set; } = 300;

    /// <summary>Arka plan eşik kontrolü periyodu (dakika).</summary>
    public int CheckIntervalMinutes { get; set; } = 5;

    /// <summary>Hedef Google Drive klasör kimliği (boşsa kök dizine yüklenir).</summary>
    public string FolderId { get; set; } = string.Empty;

    // OAuth 2.0 (kişisel Gmail Drive) — refresh token akışı
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>Yüklenen dosya "bağlantıya sahip herkes" ile görüntülenebilir yapılsın mı? (sitede göstermek için gerekli)</summary>
    public bool MakePublic { get; set; } = true;

    public bool IsConfigured =>
        Enabled
        && !string.IsNullOrWhiteSpace(ClientId)
        && !string.IsNullOrWhiteSpace(ClientSecret)
        && !string.IsNullOrWhiteSpace(RefreshToken);

    public long ThresholdBytes => (long)Math.Max(1, ThresholdMegabytes) * 1024 * 1024;
}
