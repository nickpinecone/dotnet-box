using System;
using System.Collections.Generic;
using Api.Features.Students.DTOs;
using Api.Features.Users.DTOs;

namespace Api.Features.Chats.DTOs;

public class ReplyDto
{
    public int Id { get; set; }
    public required int TelegramId { get; set; }
}

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
}

public class ChatDto
{
    public int Id { get; set; }
    
    public required int UnreadCount { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public required int UserId { get; set; }
    public required int StudentId { get; set; }

    public IEnumerable<MessageDto> Messages { get; set; } = [];
}