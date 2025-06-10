using System.Linq;
using Api.Features.Attachments.DTOs;
using Api.Infrastructure.Extensions;
using Api.Models;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Attachments;

[Mapper]
public partial class AttachmentMapper : IMapper
{
    public partial AttachmentDto Map(Attachment attachment);
    public partial IQueryable<AttachmentDto> Map(IQueryable<Attachment> attachments);
}