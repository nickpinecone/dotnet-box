using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Chats.DTOs;
using Api.Infrastructure.Rest;
using Api.Models;
using Api.Services.UserAccessor;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Chats.Queries;

public static class GetMyChats
{
    public static async Task<Ok<PagedList<ChatDto>>> Handle(
        AppDbContext db,
        ChatMapper mapper,
        IUserAccessor userAccessor,
        string? search,
        int? page,
        int? limit
    )
    {
        var user = await userAccessor.GetUserAsync();

        if (user is null)
        {
            throw new AuthenticationFailureException("User is unauthenticated");
        }

        var query = db.Chats
            .Where(ch => ch.UserId == user.Id)
            .Include(ch => ch.User)
            .Include(ch => ch.Student)
            .Include(ch => ch.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .Take(1)
            )
            .OrderByDescending(ch => ch.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .First().CreatedAt
            )
            .AsSplitQuery();

        var filtered = Filter(query, search);
        var paged = await PagedList<ChatDto>.CreateAsync(mapper.Map(filtered), page, limit);

        // TODO already accounted for in the Include but doesn't work for some reason
        // need more testing to figure out why
        foreach (var chat in paged.Content)
        {
            chat.Messages = chat.Messages.Take(1);
        }

        return TypedResults.Ok(paged);
    }

    private static IQueryable<Chat> Filter(IQueryable<Chat> items, string? search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            items = items
                .Where(i => i.Student!.Email.ToLower().Contains(search.ToLower()));
        }

        return items;
    }
}