using Api.Features.Messages.Commands;
using Api.Features.Messages.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Messages;

public class MessageRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app
            .MapGroup("")
            .WithTags("Сообщения");

        group.MapPost("/messages", SendMessage.Handle)
            .DisableAntiforgery();

        group.MapGet("/messages/my", GetMessages.Handle)
            .WithDescription(
                $"Получение сообщений пользователя"
            );

        group.MapGet("/messages/{id:int}", GetMessageById.Handle)
            .WithDescription(
                $"Получение сообщения по id"
            );
    }
}