using System.Collections.Generic;
using Api.Features.Messages.DTOs;
using Api.Infrastructure.Extensions;
using Api.Models;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Messages;

[Mapper]
public partial class MessageMapper : IMapper
{
    public partial MessageDto Map(Message message);
    public partial IEnumerable<MessageDto> Map(IEnumerable<Message> messages);
}