using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using News.Infrastructure.Extensions;
using News.Features.Attachments.Queries;
using News.Features.Newsletters.Commands;

namespace News.Features.Newsletters;

public class NewsletterRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app.MapGroup("")
            .WithTags("Рассылки");

        group.MapPost("/news", CreateNewsletter.Handle)
            .DisableAntiforgery()
            .WithDescription(
                """
                Создать рассылку. Отправление сообщений происходит в фоновой службе, 
                поэтому их статусы будут доступны по степени отправления
                """
            );
    }
}