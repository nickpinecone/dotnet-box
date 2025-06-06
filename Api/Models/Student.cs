using System.Collections.Generic;

namespace Api.Models;

public class Student
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string TelegramId { get; set; }
    
    public ICollection<Chat> Chats { get; set; } = [];
}