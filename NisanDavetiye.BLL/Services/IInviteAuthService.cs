namespace NisanDavetiye.BLL.Services;

public interface IInviteAuthService
{
    Task<bool> IsValidDavetKeyAsync(string? provided);
}
