using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using News.Infrastructure.Extensions;
using News.Features.Attachments.Queries;

namespace News.Features.Attachments;

public class AttachmentRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app
            .MapGroup("")
            .WithTags("Файлы");
        
        group.MapGet("/attachments/{id:int}", DownloadAttachment.Handle)
            .WithDescription(
                $"Скачивание файла по id"
            );
    }
}