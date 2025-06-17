using System;
using System.IO;

namespace News.Services.FileStorage;

public class BlobData
{
    public required Stream Stream { get; set; }
    public required string ContentType { get; set; }
    public required string Name { get; set; }
}

public class BlobResponse
{
    public required Guid BlobId { get; set; }
    public required string Name { get; set; }
    public required string MimeType { get; set; }
}
