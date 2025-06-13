using Api.Features.Users.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Users;

public class UserRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        app.MapGet("/users/all", GetAllUsers.Handle)
            .WithTags("Пользователи");
    }
}