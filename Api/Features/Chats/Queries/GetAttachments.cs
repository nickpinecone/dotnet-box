using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Attachments;
using Api.Features.Attachments.DTOs;
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

public static class GetAttachments
{
    public static async Task<Results<Ok<PaginatedList<AttachmentDto>>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        AttachmentMapper mapper,
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

        var query = db.Attachments
            .Include(a => a.Chat)
            .Where(a => a.Chat!.UserId == user.Id && a.Chat.StudentId == studentId)
            .AsSplitQuery();

        var paged = await PaginationService.CreateAsync(
            query,
            a => a.CreatedAt,
            a => a.Id,
            cursor, limit, mode
        );

        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }
}