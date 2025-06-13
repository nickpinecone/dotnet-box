using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Attachments.DTOs;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Rest;
using Api.Models;
using Api.Services.UserAccessor;
using FluentResults;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Attachments.Queries;

public static class GetAttachments
{
    public static async Task<Results<Ok<PaginatedList<AttachmentDto>>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        AttachmentMapper mapper,
        IUserAccessor userAccessor,
        [FromQuery(Name = "student_id")] int? studentId,
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

        if (studentId is not null)
        {
            var student = await db.Students.FirstOrDefaultAsync(s => s.Id == studentId);

            if (student is null)
            {
                return Result.Fail($"Student does not exist: {studentId}").ToNotFoundProblem();
            }
        }

        var query = db.Attachments
            .Include(a => a.Chat)
            .AsSplitQuery();

        query = studentId is null
            ? query.Where(m => m.Chat!.UserId == user.Id)
            : query.Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == studentId);

        var filtered = Filter(query, search);

        var paged = await PaginationService.CreateAsync(
            filtered,
            a => a.CreatedAt,
            a => a.Id,
            cursor, limit, mode
        );

        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }

    private static IQueryable<Attachment> Filter(IQueryable<Attachment> items, string? search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            items = items
                .Where(i => i.Name.ToLower().Contains(search.ToLower()));
        }

        return items;
    }
}