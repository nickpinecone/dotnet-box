using System;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Chats.DTOs;
using Api.Infrastructure.Extensions;
using Api.Models;
using Api.Services.UserAccessor;
using FluentResults;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Chats.Queries;

public static class GetChatById
{
    public static async Task<Results<Ok<ChatDto>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        ChatMapper mapper,
        IUserAccessor userAccessor,
        [FromRoute(Name = "student_id")] int studentId
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
        
        var chat = await db.Chats
            .Include(ch => ch.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .Take(1)
            )
            .FirstOrDefaultAsync(ch => ch.StudentId == studentId && ch.UserId == user.Id);
        
        chat ??= new Chat()
        {
            CreatedAt = DateTime.MinValue,
            UnreadCount = 0,
            StudentId = studentId,
            UserId = user.Id,
        };

        return TypedResults.Ok(mapper.Map(chat));
    }
}