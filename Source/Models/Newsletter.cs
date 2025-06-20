using System;
using System.Collections.Generic;

namespace Newleaf.Models;

public class Newsletter
{
    public int Id { get; set; }
    
    public required string Content { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public ICollection<Message> Messages { get; set; } = [];
    public ICollection<Attachment> Attachments { get; set; } = [];
}
