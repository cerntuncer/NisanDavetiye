using NisanDavetiye.BLL.DTOs;

namespace NisanDavetiye.BLL.Services;

public interface IRsvpService
{
    Task<RsvpDto> KaydetAsync(RsvpOlusturDto dto);
    Task<IReadOnlyList<RsvpDto>> ListeleAsync();
    Task GizleFromAdminAsync(int id);
    Task<byte[]> ExcelExportAsync();
}
