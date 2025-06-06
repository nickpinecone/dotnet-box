using System;
using System.Collections.Generic;

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
    
    public ICollection<Attachment> Attachments { get; set; } = [];
}