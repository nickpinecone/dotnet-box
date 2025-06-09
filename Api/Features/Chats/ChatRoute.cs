using Api.Features.Chats.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;

namespace Api.Features.Chats;

public class ChatRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        app.MapGet("/chats/my", GetMyChats.Handle);
    }
}
