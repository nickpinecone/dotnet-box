using System;
using System.Collections.Generic;
using Api.Features.Messages.DTOs;

namespace Api.Features.Chats.DTOs;

public class ChatDto
{
    public int Id { get; set; }
    
    public required int UnreadCount { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int UserId { get; set; }
    public required int StudentId { get; set; }

    public IEnumerable<MessageDto> Messages { get; set; } = [];
}