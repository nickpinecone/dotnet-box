using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newleaf.Features.Newsletters.Commands;
using Newleaf.Features.Newsletters.Queries;
using Newleaf.Infrastructure.Extensions;
using Newleaf.Models;

namespace Newleaf.Features.Newsletters;

public class NewsletterRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        var group = app.MapGroup("")
            .WithTags("Рассылки");

        group.MapGet("/newsletters", GetAllNewsletters.Handle)
            .WithDescription(
                $"""
                 Получить все рассылки. 
                 {nameof(Newsletter.Messages)} содержит первые 10 значений. 
                 Фильтр по {nameof(Message.Status)} происходит так:
                 {nameof(StatusCode.lost)} - в рассылке есть хотя бы одно неотправленное сообщение.
                 {nameof(StatusCode.sent)} - в рассылке отправлены все сообщения
                 """
            );

        group.MapPost("/newsletters", CreateNewsletter.Handle)
            .DisableAntiforgery()
            .WithDescription(
                $"""
                 Создать рассылку. 
                 Отправление сообщений происходит в фоновой службе, поэтому их статусы будут доступны по степени отправления
                 """
            );

        group.MapGet("/newsletters/{id:int}", GetNewsletterById.Handle)
            .WithDescription(
                $"""
                 Получить рассылку по id. 
                 {nameof(Newsletter.Messages)} содержит первые 10 значений
                 """
            );

        group.MapGet("/newsletters/{id:int}/messages", GetMessages.Handle)
            .WithDescription(
                $"""
                 Получить сообщения рассылки
                 """
            );
    }
}