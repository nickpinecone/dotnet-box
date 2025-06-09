using System.Collections.Generic;
using Riok.Mapperly.Abstractions;

namespace Api.Models;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }

    public ICollection<Chat> Chats { get; set; } = [];
}