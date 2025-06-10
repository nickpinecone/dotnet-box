using Api.Features.Messages.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Messages;

public class MessageRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app.MapGroup("").WithTags("Messages");

        group.MapGet("/messages/{id:int}", GetMessageById.Handle);
    }
}