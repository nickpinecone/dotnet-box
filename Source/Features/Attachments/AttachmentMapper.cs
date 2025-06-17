using System.Collections.Generic;
using News.Features.Attachments.DTOs;
using News.Infrastructure.Extensions;
using News.Models;
using Riok.Mapperly.Abstractions;

namespace News.Features.Attachments;

[Mapper]
public partial class AttachmentMapper : IMapper
{
    public partial AttachmentDto Map(Attachment attachment);
    public partial IEnumerable<AttachmentDto> Map(IEnumerable<Attachment> attachments);
}