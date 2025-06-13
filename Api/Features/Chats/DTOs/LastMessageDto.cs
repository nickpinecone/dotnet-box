using System;
using System.Collections.Generic;
using Api.Features.Messages.DTOs;

namespace Api.Features.Chats.DTOs;

public class LastMessageDto
{
    public int Id { get; set; }
    
    public required int TelegramId { get; set; }
    public required string Content { get; set; }
    public required bool IsRead { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int ChatId { get; set; }
    public int? UserId { get; set; }
    public int? StudentId { get; set; }
    
    public IEnumerable<MessageAttachmentDto> Attachments { get; set; } = [];
}