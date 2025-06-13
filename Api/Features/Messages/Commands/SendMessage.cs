using System;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Messages.DTOs;
using Api.Features.Students;
using Api.Infrastructure.Extensions;
using Api.Models;
using Api.Services.RequestCache;
using Api.Services.UserAccessor;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Messages.Commands;

public static class SendMessage
{
    public record Request(int StudentId, int? ReplyTo, string Content, IFormFileCollection? Files);

    public class Validator : AbstractValidator<Request>
    {
        public Validator(AppDbContext db, IRequestCache cache)
        {
            RuleFor(x => x.StudentId)
                .MustAsync(async (id, cancellation) =>
                {
                    var student = await db.Students.FirstOrDefaultAsync(s => s.Id == id, cancellation);

                    return student != null;
                })
                .WithMessage(StudentErrors.NotFound());

            RuleFor(x => x.ReplyTo)
                .MustAsync(async (id, cancellation) =>
                {
                    if (id is null)
                    {
                        return true;
                    }

                    var reply = await db.Messages.FirstOrDefaultAsync(m => m.Id == id, cancellation);

                    return reply != null;
                })
                .WithMessage(MessageErrors.NotFound());

            RuleFor(x => x.Content)
                .NotEmpty()
                .When(x => x.Files is null || x.Files.Count <= 0)
                .WithMessage(MessageErrors.EmptyMessage());
        }
    }

    public static async Task<Results<Ok<MessageDto>, ValidationProblem>> Handle(
        AppDbContext db,
        MessageMapper mapper,
        IUserAccessor userAccessor,
        IValidator<Request> validator,
        // Parameters
        [FromQuery(Name = "student_id")] int studentId,
        [FromQuery(Name = "reply_to")] int? replyTo,
        string content,
        IFormFileCollection? files
    )
    {
        var request = new Request(studentId, replyTo, content, files);
        var user = await userAccessor.GetUserAsync();
        var validation = await validator.ValidateAsync(request);

        if (!validation.IsValid)
        {
            return validation.ToValidationProblem();
        }

        var message = new Message()
        {
            Content = request.Content,
            ChatId = -1,
            CreatedAt = DateTime.UtcNow,
            IsRead = false,
            TelegramId = 1,
            UserId = user.Id
        };

        return TypedResults.Ok(mapper.Map(message));
    }
}