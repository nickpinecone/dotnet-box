using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Chats.DTOs;
using Api.Infrastructure.Rest;
using Api.Models;
using Api.Services.UserAccessor;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Chats.Queries;

public static class GetMyChats
{
    private record Request(CursorType? Cursor, string? Search, CursorMode Mode, int Limit);

    public static async Task<Ok<PaginatedList<ChatDto>>> Handle(
        AppDbContext db,
        ChatMapper mapper,
        IUserAccessor userAccessor,
        // Parameters
        CursorType? cursor,
        string? search,
        CursorMode mode = CursorMode.before,
        int limit = -1
    )
    {
        var request = new Request(cursor, search, mode, limit);
        var user = await userAccessor.GetUserAsync();

        var query = db.Chats
            .Where(ch => ch.UserId == user.Id)
            .Include(ch => ch.User)
            .Include(ch => ch.Student)
            .Include(ch => ch.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .Take(1)
            )
            .AsSplitQuery();

        query = Filter(query, request);

        var paged = await PaginationService.CreateAsync(
            query,
            ch => ch.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .First().CreatedAt,
            ch => ch.Id,
            request.Cursor, request.Limit, request.Mode
        );

        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }

    private static IQueryable<Chat> Filter(IQueryable<Chat> query, Request request)
    {
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query
                .Where(i => i.Student!.Email.ToLower().Contains(request.Search.ToLower()));
        }

        return query;
    }
}