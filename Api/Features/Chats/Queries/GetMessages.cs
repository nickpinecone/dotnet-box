using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Messages;
using Api.Features.Messages.DTOs;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Rest;
using Api.Services.UserAccessor;
using FluentResults;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Chats.Queries;

public static class GetMessages
{
    public static async Task<Results<Ok<PaginatedList<MessageDto>>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        MessageMapper mapper,
        IUserAccessor userAccessor,
        [FromRoute(Name = "student_id")] int studentId,
        CursorType? cursor,
        string? search,
        CursorMode mode = CursorMode.before,
        int limit = -1
    )
    {
        var user = await userAccessor.GetUserAsync();

        if (user is null)
        {
            throw new AuthenticationFailureException("User is unauthenticated");
        }

        var student = await db.Students.FirstOrDefaultAsync(s => s.Id == studentId);

        if (student is null)
        {
            return Result.Fail($"Student does not exist: {studentId}").ToNotFoundProblem();
        }

        var query = db.Messages
            .Include(m => m.Chat)
            .Include(m => m.Replies)
            .Include(m => m.ReplyTo)
            .Include(m => m.Attachments)
            .Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == studentId)
            .AsSplitQuery();

        if (cursor is null)
        {
            var firstUnread = await db.Messages
                .Include(m => m.Chat)
                .Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == studentId)
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
            cursor, limit, mode
        );

        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }
}