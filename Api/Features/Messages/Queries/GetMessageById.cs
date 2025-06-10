using System.Threading.Tasks;
using Api.Data;
using Api.Features.Messages.DTOs;
using Api.Infrastructure.Extensions;
using Api.Services.UserAccessor;
using FluentResults;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Messages.Queries;

public static class GetMessageById
{
    public static async Task<Results<Ok<MessageDto>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        MessageMapper mapper,
        IUserAccessor userAccessor,
        int id
    )
    {
        var user = await userAccessor.GetUserAsync();

        if (user is null)
        {
            throw new AuthenticationFailureException("User is unauthenticated");
        }

        var message = await db.Messages
            .Include(m => m.Chat)
            .Include(m => m.Replies)
            .Include(m => m.ReplyTo)
            .Include(m => m.Attachments)
            .AsSplitQuery()
            .FirstOrDefaultAsync(m => m.Id == id && m.Chat!.UserId == user.Id);

        if (message is null)
        {
            return Result.Fail($"Message does not exist or is not related to you: {id}").ToNotFoundProblem();
        }

        return TypedResults.Ok(mapper.Map(message));
    }
}