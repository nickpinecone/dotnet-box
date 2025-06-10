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
    public static async Task<Results<Ok<PagedList<AttachmentDto>>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        AttachmentMapper mapper,
        IUserAccessor userAccessor,
        [FromRoute(Name = "student_id")] int studentId,
        int? page = null,
        int? limit = null
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

        if (page is null || page <= 0)
        {
            var count = await db.Attachments
                .OrderBy(a => a.CreatedAt)
                .ThenBy(a => a.Id)
                .CountAsync();

            page = (count / (limit ?? 1));
        }

        var attachments = db.Attachments
            .Include(a => a.Chat)
            .Where(a => a.Chat!.UserId == user.Id && a.Chat.StudentId == studentId)
            .OrderBy(a => a.CreatedAt)
            .ThenBy(a => a.Id)
            .AsSplitQuery();

        var paged = await PagedList<AttachmentDto>.CreateAsync(mapper.Map(attachments), page, limit);

        return TypedResults.Ok(paged);
    }
}