using System.Diagnostics.CodeAnalysis;

namespace WebVsa;

[SuppressMessage("ReSharper", "InconsistentNaming")]
public class AppSettings
{
    public string MINIO_URL { get; set; } = null!;
    public string MINIO_ROOT_USER { get; set; } = null!;
    public string MINIO_ROOT_PASSWORD { get; set; } = null!;
    public string MINIO_BUCKET { get; set; } = null!;

    public string POSTGRES_URL { get; set; } = null!;
    public string POSTGRES_DB { get; set; } = null!;
    public string POSTGRES_PASSWORD { get; set; } = null!;
    public string POSTGRES_USER { get; set; } = null!;
}