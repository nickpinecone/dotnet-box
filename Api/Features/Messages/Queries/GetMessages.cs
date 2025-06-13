using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Messages.DTOs;
using Api.Features.Students;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Rest;
using Api.Models;
using Api.Services.UserAccessor;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Messages.Queries;

public static class GetMessages
{
    public record Request(int? StudentId, CursorType? Cursor, string? Search, CursorMode Mode, int Limit);

    public class Validator : AbstractValidator<Request>
    {
        public Validator(AppDbContext db)
        {
            RuleFor(x => x.StudentId)
                .MustAsync(async (id, cancellation) =>
                {
                    if (id is null)
                    {
                        return true;
                    }

                    var student = await db.Students.FirstOrDefaultAsync(s => s.Id == id, cancellation);
                    return student != null;
                })
                .WithMessage(StudentErrors.NotFound());
        }
    }

    public static async Task<Results<Ok<PaginatedList<MessageDto>>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        MessageMapper mapper,
        IUserAccessor userAccessor,
        IValidator<Request> validator,
        // Parameters
        [FromQuery(Name = "student_id")] int? studentId,
        CursorType? cursor,
        string? search,
        CursorMode mode = CursorMode.before,
        int limit = -1
    )
    {
        var request = new Request(studentId, cursor, search, mode, limit);
        var user = await userAccessor.GetUserAsync();
        var validation = await validator.ValidateAsync(request);

        if (!validation.IsValid)
        {
            return validation.ToNotFoundProblem();
        }

        var query = db.Messages
            .Include(m => m.Chat)
            .Include(m => m.Replies)
            .Include(m => m.ReplyTo)
            .Include(m => m.Attachments)
            .AsSplitQuery();

        query = request.StudentId is null
            ? query.Where(m => m.Chat!.UserId == user.Id)
            : query.Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == request.StudentId);

        query = Filter(query, request);

        if (request.Cursor is null)
        {
            var firstUnread = await db.Messages
                .Include(m => m.Chat)
                .Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == request.StudentId)
                .OrderBy(m => m.CreatedAt)
                .ThenBy(m => m.Id)
                .FirstOrDefaultAsync(m => !m.IsRead && m.StudentId != null);

            if (firstUnread is not null)
            {
                cursor = new CursorType(firstUnread.CreatedAt, firstUnread.Id);
                mode = CursorMode.around;
            }
        }

        var paged = await PaginationService.CreateAsync(
            query,
            m => m.CreatedAt,
            m => m.Id,
            cursor, request.Limit, mode
        );

        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }

    private static IQueryable<Message> Filter(IQueryable<Message> query, Request request)
    {
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query
                .Where(i => i.Content.ToLower().Contains(request.Search.ToLower()));
        }

        return query;
    }
}