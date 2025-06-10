using System;

namespace Api.Features.Attachments.DTOs;

public class AttachmentDto
{
    public int Id { get; set; }
    public required Guid BlobId { get; set; }
    public required string Name { get; set; }
    public required string MimeType { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int ChatId { get; set; }
    public required int MessageId { get; set; }
}