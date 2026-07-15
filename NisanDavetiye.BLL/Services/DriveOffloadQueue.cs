using System.Threading.Channels;

namespace NisanDavetiye.BLL.Services;

/// <summary>Drive'a aktarılacak galeri kayıtlarının kimliklerini tutan basit kuyruk.</summary>
public interface IDriveOffloadQueue
{
    ValueTask EnqueueAsync(int galeriResmiId, CancellationToken cancellationToken = default);
    IAsyncEnumerable<int> DequeueAllAsync(CancellationToken cancellationToken);
}

public class DriveOffloadQueue : IDriveOffloadQueue
{
    private readonly Channel<int> _channel =
        Channel.CreateUnbounded<int>(new UnboundedChannelOptions { SingleReader = true });

    public ValueTask EnqueueAsync(int galeriResmiId, CancellationToken cancellationToken = default) =>
        _channel.Writer.WriteAsync(galeriResmiId, cancellationToken);

    public IAsyncEnumerable<int> DequeueAllAsync(CancellationToken cancellationToken) =>
        _channel.Reader.ReadAllAsync(cancellationToken);
}
