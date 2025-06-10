using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Messages.DTOs;
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

namespace Api.Features.Messages.Queries;

public static class GetMessages
{
    public static async Task<Results<Ok<PagedList<MessageDto>>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        MessageMapper mapper,
        IUserAccessor userAccessor,
        [FromQuery(Name = "student_id")] int studentId,
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

        // If we get this, it means we want to know the page, where we have an unread message
        // In a chat, we should start from an unread message, instead of at the very bottom
        if (page is null || page <= 0)
        {
            var firstUnread = await db.Messages
                .Include(m => m.Chat)
                .Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == studentId)
                .OrderBy(m => m.CreatedAt)
                .ThenBy(m => m.Id)
                .FirstOrDefaultAsync(m => !m.IsRead && m.StudentId != null);

            if (firstUnread == null)
            {
                var count = await db.Messages
                    .OrderBy(m => m.CreatedAt)
                    .ThenBy(m => m.Id)
                    .CountAsync();
                
                page = (count / (limit ?? 1));
            }
            else
            {
                var unreadIndex = await db.Messages
                    .OrderBy(m => m.CreatedAt)
                    .ThenBy(m => m.Id)
                    .CountAsync(m =>
                        m.CreatedAt < firstUnread.CreatedAt ||
                        (m.CreatedAt == firstUnread.CreatedAt && m.Id < firstUnread.Id)
                    );
            
                page = (unreadIndex / (limit ?? 1)) + 1;
            }
        }

        var messages = db.Messages
            .Include(m => m.Chat)
            .Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == studentId)
            .OrderBy(m => m.CreatedAt)
            .ThenBy(m => m.Id);

        var paged = await PagedList<MessageDto>.CreateAsync(mapper.Map(messages), page, limit);

        return TypedResults.Ok(paged);
    }
}