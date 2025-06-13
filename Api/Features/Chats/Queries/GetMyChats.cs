using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
    public static async Task<Ok<PaginatedList<ChatDto>>> Handle(
        AppDbContext db,
        ChatMapper mapper,
        IUserAccessor userAccessor,
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

        var filtered = Filter(query, search);

        var paged = await PaginationService.CreateAsync(
            filtered,
            ch => ch.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .First().CreatedAt,
            ch => ch.Id,
            cursor, limit, mode
        );

        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
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