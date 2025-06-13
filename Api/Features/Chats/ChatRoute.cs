using Api.Features.Chats.Queries;
using Api.Infrastructure.Extensions;
using Api.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Chats;

public class ChatRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app
            .MapGroup("")
            .WithTags("Чаты");

        group.MapGet("/chats/my", GetMyChats.Handle)
            .WithDescription(
                $"Получение чатов пользователя, каждый чат имеет последнее сообщение в {nameof(Chat.Messages)}"
            );

        group.MapGet("/chats/{student_id:int}", GetChatById.Handle)
            .WithDescription(
                $"""
                 Получение чата по student_id, каждый чат имеет последнее сообщение в {nameof(Chat.Messages)}.
                 Для получения всех сообщений используется {"/messages/my?chat_id="}
                 """
            );
    }
}