using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using NisanDavetiye.BLL.Options;
using NisanDavetiye.BLL.Services;

namespace NisanDavetiye.BLL;

public static class DependencyInjection
{
    public static IServiceCollection AddBll(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<GaleriStorageOptions>(configuration.GetSection(GaleriStorageOptions.SectionName));
        services.AddScoped<IDavetiyeService, DavetiyeService>();
        services.AddScoped<IInviteAuthService, InviteAuthService>();
        services.AddScoped<IRsvpService, RsvpService>();
        services.AddScoped<IGaleriService, GaleriService>();
        return services;
    }
}
