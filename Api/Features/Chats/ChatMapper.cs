using System.Linq;
using Api.Features.Chats.DTOs;
using Api.Infrastructure.Extensions;
using Api.Models;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Chats;

[Mapper]
public partial class ChatMapper : IMapper
{
    public partial ChatDto Map(Chat chat);
    public partial IQueryable<ChatDto> Map(IQueryable<Chat> chats);
}