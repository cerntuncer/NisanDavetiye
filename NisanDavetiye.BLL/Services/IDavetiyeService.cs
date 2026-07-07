using NisanDavetiye.BLL.DTOs;

namespace NisanDavetiye.BLL.Services;

public interface IDavetiyeService
{
    Task<DavetiyeDto> GetDavetiyeByUidAsync(string uid);
    Task<DavetiyeAdminDto> GetDavetiyeForAdminAsync();
    Task<DavetiyeAdminDto> GuncelleAsync(DavetiyeGuncelleDto dto);
}
