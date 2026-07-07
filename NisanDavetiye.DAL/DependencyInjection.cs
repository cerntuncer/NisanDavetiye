using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using NisanDavetiye.DAL.Data;
using NisanDavetiye.DAL.Repositories;

namespace NisanDavetiye.DAL;

public static class DependencyInjection
{
    public static IServiceCollection AddDal(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<NisanDavetiyeDbContext>(options =>
            options
                .UseSqlite(connectionString)
                .ConfigureWarnings(w =>
                    w.Ignore(RelationalEventId.PendingModelChangesWarning)));

        services.AddScoped<IDavetiyeRepository, DavetiyeRepository>();
        services.AddScoped<IRsvpRepository, RsvpRepository>();

        return services;
    }
}
