using System.Security.Cryptography;
using System.Text;

namespace NisanDavetiye.BLL.Security;

public static class SecureCompare
{
    public static bool Equals(string? expected, string? provided)
    {
        if (string.IsNullOrEmpty(expected) || provided is null)
            return false;

        var expectedBytes = Encoding.UTF8.GetBytes(expected);
        var providedBytes = Encoding.UTF8.GetBytes(provided);

        if (expectedBytes.Length != providedBytes.Length)
            return false;

        return CryptographicOperations.FixedTimeEquals(expectedBytes, providedBytes);
    }
}
