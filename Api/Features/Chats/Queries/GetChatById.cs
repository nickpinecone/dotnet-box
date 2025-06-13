using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Chats.DTOs;
using Api.Features.Students;
using Api.Infrastructure.Extensions;
using Api.Models;
using Api.Services.UserAccessor;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Chats.Queries;

public static class GetChatById
{
    public record Request(int StudentId);

    public class Validator : AbstractValidator<Request>
    {
        public Validator(AppDbContext db)
        {
            RuleFor(x => x.StudentId)
                .MustAsync(async (id, cancellation) =>
                {
                    var student = await db.Students.FirstOrDefaultAsync(s => s.Id == id, cancellation);
                    return student != null;
                })
                .WithMessage(StudentErrors.NotFound());
        }
    }

    public static async Task<Results<Ok<ChatDto>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        ChatMapper mapper,
        IUserAccessor userAccessor,
        IValidator<Request> validator,
        // Parameters
        [FromRoute(Name = "student_id")] int studentId
    )
    {
        var request = new Request(studentId);
        var user = await userAccessor.GetUserAsync();
        var validation = await validator.ValidateAsync(request);

        if (!validation.IsValid)
        {
            return validation.ToNotFoundProblem();
        }

        var chat = await db.Chats
            .Include(ch => ch.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .Take(1)
            )
            .FirstOrDefaultAsync(ch => ch.StudentId == request.StudentId && ch.UserId == user.Id);

        chat ??= new Chat()
        {
            CreatedAt = DateTime.MinValue,
            UnreadCount = 0,
            StudentId = request.StudentId,
            UserId = user.Id,
        };

        return TypedResults.Ok(mapper.Map(chat));
    }
}