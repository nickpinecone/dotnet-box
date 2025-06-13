using Api.Features.Attachments.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Attachments;

public class AttachmentRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app.MapGroup("").WithTags("Attachments");

        group.MapGet("/attachments/my", GetAttachments.Handle);
    }
}