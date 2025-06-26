using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using WebVsa.Features.Attachments.Queries;
using WebVsa.Infrastructure.Extensions;

namespace WebVsa.Features.Attachments;

public class AttachmentRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app.MapGroup("")
            .WithTags("Файлы");

        group.MapGet("/attachments/{id:int}", DownloadAttachment.Handle)
            .WithDescription(
                $"Скачать файл по id"
            );
    }
}