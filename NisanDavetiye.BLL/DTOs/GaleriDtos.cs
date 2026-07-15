namespace NisanDavetiye.BLL.DTOs;

public record GaleriUploadResultDto(
    int UploadedCount,
    IReadOnlyList<string> FileNames,
    string Message);

public record GaleriSilResultDto(int DeletedCount);

public record GaleriUploadFile(
    string FileName,
    string ContentType,
    Stream Content,
    long Length);

public record GaleriDriveStatusDto(
    bool DriveEnabled,
    long LocalUsedBytes,
    long ThresholdBytes,
    int ThresholdMegabytes,
    int PendingCount,
    int OffloadedCount,
    bool OverThreshold);

public record GaleriDriveOffloadResultDto(
    int QueuedCount,
    string Message);
