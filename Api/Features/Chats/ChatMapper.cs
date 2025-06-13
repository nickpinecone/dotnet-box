using System.Collections.Generic;
using Api.Features.Chats.DTOs;
using Api.Infrastructure.Extensions;
using Api.Models;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Chats;

[Mapper]
public partial class ChatMapper : IMapper
{
    public partial ChatDto Map(Chat chat);
    public partial IEnumerable<ChatDto> Map(IEnumerable<Chat> chats);
}