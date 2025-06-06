using System.IO;

namespace Api.Services.FileStorage;

public class BlobData
{
    public required Stream Stream { get; set; }
    public required string ContentType { get; set; }
    public required string Name { get; set; }
}