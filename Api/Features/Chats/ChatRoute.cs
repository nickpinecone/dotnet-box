using Api.Features.Chats.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Chats;

public class ChatRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app.MapGroup("").WithTags("Chats");
        
        group.MapGet("/chats/my", GetMyChats.Handle);
        group.MapGet("/chats/{student_id:int}", GetChatById.Handle);
    }
}
