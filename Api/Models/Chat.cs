using System;
using System.Collections.Generic;
using System.Linq;
using Api.Features.Chats.Queries;
using Api.Infrastructure.Rest;

namespace Api.Models;

public class Chat
{
    public int Id { get; set; }

    public required int UnreadCount { get; set; }
    public required DateTime CreatedAt { get; set; }

    public required int UserId { get; set; }
    public User? User { get; set; }

    public required int StudentId { get; set; }
    public Student? Student { get; set; }

    public ICollection<Message> Messages { get; set; } = [];
    public ICollection<Attachment> Attachments { get; set; } = [];

    public string Cursor =>
        CursorType.Encode(new CursorType(Messages.FirstOrDefault()?.CreatedAt ?? DateTime.MinValue, Id));
}