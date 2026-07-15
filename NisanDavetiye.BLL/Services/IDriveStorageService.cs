namespace NisanDavetiye.BLL.Services;

public interface IDriveStorageService
{
    bool IsConfigured { get; }

    /// <summary>Yerel dosyayı Drive'a yükler, dosya kimliğini döndürür.</summary>
    Task<string> UploadAsync(
        string localPath,
        string fileName,
        string contentType,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(string fileId, CancellationToken cancellationToken = default);

    /// <summary>Sitede &lt;img&gt; ile gösterilebilecek görüntüleme bağlantısı.</summary>
    string BuildViewUrl(string fileId);
}
