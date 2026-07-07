var uiDir = ResolveUiDirectory();

Console.WriteLine($"UI klasörü: {uiDir}");
Console.WriteLine("Vite dev sunucusu başlatılıyor (npm run dev)...");
Console.WriteLine("Durdurmak için Ctrl+C");
Console.WriteLine();

using var process = new System.Diagnostics.Process();
process.StartInfo = new System.Diagnostics.ProcessStartInfo
{
    FileName = "cmd.exe",
    Arguments = "/c npm run dev",
    WorkingDirectory = uiDir,
    UseShellExecute = false,
    RedirectStandardOutput = true,
    RedirectStandardError = true,
};

process.OutputDataReceived += (_, e) =>
{
    if (e.Data is not null)
        Console.WriteLine(e.Data);
};

process.ErrorDataReceived += (_, e) =>
{
    if (e.Data is not null)
        Console.Error.WriteLine(e.Data);
};

process.Start();
process.BeginOutputReadLine();
process.BeginErrorReadLine();

using var cts = new CancellationTokenSource();
Console.CancelKeyPress += (_, e) =>
{
    e.Cancel = true;
    cts.Cancel();
};

try
{
    await process.WaitForExitAsync(cts.Token);
}
catch (OperationCanceledException)
{
    if (!process.HasExited)
        process.Kill(entireProcessTree: true);
}

static string ResolveUiDirectory()
{
    var candidates = new[]
    {
        Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "NisanDavetiye.UI")),
        Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "NisanDavetiye.UI")),
        Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "NisanDavetiye.UI")),
    };

    foreach (var dir in candidates)
    {
        if (File.Exists(Path.Combine(dir, "package.json")))
            return dir;
    }

    throw new DirectoryNotFoundException(
        "NisanDavetiye.UI klasörü bulunamadı. package.json dosyasının olduğu klasörü kontrol edin.");
}
