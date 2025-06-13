using System;
using System.Collections.Generic;
using Api.Features.Attachments.DTOs;

namespace Api.Features.Messages.DTOs;

public class MessageDto
{
    public int Id { get; set; }
    
    public required int TelegramId { get; set; }
    public required string Content { get; set; }
    public required bool IsRead { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int ChatId { get; set; }
    public int? UserId { get; set; }
    public int? StudentId { get; set; }
    
    public ReplyDto? ReplyTo { get; set; }
    public IEnumerable<ReplyDto> Replies { get; set; } = [];
    
    public IEnumerable<AttachmentDto> Attachments { get; set; } = [];
    
    public required string Cursor { get; set; }
}