using Api.Features.Attachments.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Attachments;

public class AttachmentRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app
            .MapGroup("")
            .WithTags("Файлы");

        group.MapGet("/attachments/my", GetAttachments.Handle)
            .WithDescription(
                $"Получение файлов пользователя"
            );
        
        group.MapGet("/attachments/{id:int}", DownloadAttachment.Handle)
            .WithDescription(
                $"Скачивание файла по id"
            );
    }
}