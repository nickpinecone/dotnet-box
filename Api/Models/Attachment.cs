using System;
using Api.Infrastructure.Rest;

namespace Api.Models;

public class Attachment
{
    public int Id { get; set; }
    public required Guid BlobId { get; set; }
    public required string Name { get; set; }
    public required string MimeType { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int ChatId { get; set; }
    public Chat? Chat { get; set; }
    
    public required int MessageId { get; set; }
    public Message? Message { get; set; }
    
    public string Cursor => CursorType.Encode(new CursorType(CreatedAt, Id));
}