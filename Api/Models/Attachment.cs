using System;

namespace Api.Models;

public class Attachment
{
    public int Id { get; set; }
    public required Guid BlobId { get; set; }
    public required string Name { get; set; }
    public required string MimeType { get; set; }
    public required DateTime CreatedAt { get; set; }
}