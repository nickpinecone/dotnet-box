using System;
using System.Collections.Generic;

namespace Api.Features.Chats.DTOs;

public class ChatDto
{
    public int Id { get; set; }
    
    public required int UnreadCount { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int UserId { get; set; }
    public required int StudentId { get; set; }

    public IEnumerable<LastMessageDto> Messages { get; set; } = [];

    public required string Cursor { get; set; }
}