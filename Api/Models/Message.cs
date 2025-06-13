using System;
using System.Collections.Generic;
using Api.Features.Chats.Queries;
using Api.Infrastructure.Rest;

namespace Api.Models;

public class Message
{
    public int Id { get; set; }
    
    public required int TelegramId { get; set; }
    public required string Content { get; set; }
    public required bool IsRead { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int ChatId { get; set; }
    public Chat? Chat { get; set; }
    
    public int? UserId { get; set; }
    public User? User { get; set; }
    
    public int? StudentId { get; set; }
    public Student? Student { get; set; }
    
    public int? ReplyToId { get; set; }
    public Message? ReplyTo { get; set; }
    public ICollection<Message> Replies { get; set; } = [];

    public ICollection<Attachment> Attachments { get; set; } = [];
    
    public string Cursor => CursorType.Encode(new CursorType(CreatedAt, Id));
}