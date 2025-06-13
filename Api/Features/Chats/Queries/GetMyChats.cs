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

public enum CursorMode
{
    Before,
    After,
    Around
}

public record CursorType(DateTime Timestamp, int Id)
{
    // TODO change from debugging parsing
    public static string Encode(CursorType cursor)
    {
        return $"{cursor.Timestamp}_{cursor.Id}";
    }

    // TODO change from debugging parsing
    public static CursorType? Decode(string? cursor)
    {
        if (cursor is null)
        {
            return null;
        }

        var split = cursor.Split("_");
        return new CursorType(DateTime.Parse(split[0]), int.Parse(split[1]));
    }
}

// TODO add HasBefore and HasAfter in the future
public class PaginatedList<T>
{
    public IEnumerable<T> Content { get; set; } = [];
    public int Limit { get; set; }
    public int TotalRecord { get; set; }
}

public static class PaginationService
{
    public static async Task<PaginatedList<T>> CreateAsync<T>(IQueryable<T> original,
        Expression<Func<T, DateTime>> timestampExpr, Expression<Func<T, int>> idExpr, CursorType? cursor, int limit,
        CursorMode mode)
    {
        var totalRecord = await original.CountAsync();

        if (limit <= 0)
        {
            limit = -1;
        }

        List<T> content = [];

        if (cursor is null)
        {
            original = original
                .OrderByDescending(timestampExpr)
                .ThenByDescending(idExpr);

            if (limit > 0)
            {
                original = original.Take(limit);
            }

            content = await original.ToListAsync();
        }

        if (cursor is not null)
        {
            var param = timestampExpr.Parameters[0];
            var timestampMember = ((MemberExpression)timestampExpr.Body).Member.Name;
            var idMember = ((MemberExpression)idExpr.Body).Member.Name;

            var timestampProp = Expression.Property(param, timestampMember);
            var idProp = Expression.Property(param, idMember);

            if (mode == CursorMode.Before)
            {
                var expression = Expression.Lambda<Func<T, bool>>(
                    Expression.AndAlso(
                        Expression.LessThanOrEqual(timestampProp, Expression.Constant(cursor.Timestamp)),
                        Expression.LessThan(idProp, Expression.Constant(cursor.Id))
                    ),
                    param
                );

                original = original
                    .OrderByDescending(timestampExpr)
                    .ThenByDescending(idExpr)
                    .Where(expression);

                if (limit > 0)
                {
                    original = original.Take(limit);
                }

                content = await original.ToListAsync();
            }
            else if (mode == CursorMode.After)
            {
                var expression = Expression.Lambda<Func<T, bool>>(
                    Expression.AndAlso(
                        Expression.GreaterThanOrEqual(timestampProp, Expression.Constant(cursor.Timestamp)),
                        Expression.GreaterThan(idProp, Expression.Constant(cursor.Id))
                    ),
                    param
                );

                original = original
                    .OrderBy(timestampExpr)
                    .ThenBy(idExpr)
                    .Where(expression);
                
                if (limit > 0)
                {
                    original = original.Take(limit);
                }

                content = await original.ToListAsync();
                content.Reverse();
            }
            else
            {
                var expression = Expression.Lambda<Func<T, bool>>(
                    Expression.AndAlso(
                        Expression.LessThanOrEqual(timestampProp, Expression.Constant(cursor.Timestamp)),
                        Expression.LessThan(idProp, Expression.Constant(cursor.Id))
                    ),
                    param
                );

                var beforeQuery = original
                    .OrderByDescending(timestampExpr)
                    .ThenByDescending(idExpr)
                    .Where(expression);

                if (limit > 0)
                {
                    beforeQuery = beforeQuery.Take(limit);
                }

                var before = await beforeQuery.ToListAsync();

                expression = Expression.Lambda<Func<T, bool>>(
                    Expression.AndAlso(
                        Expression.GreaterThanOrEqual(timestampProp, Expression.Constant(cursor.Timestamp)),
                        Expression.GreaterThanOrEqual(idProp, Expression.Constant(cursor.Id))
                    ),
                    param
                );

                var afterQuery = original
                    .OrderBy(timestampExpr)
                    .ThenBy(idExpr)
                    .Where(expression);

                if (limit > 0)
                {
                    afterQuery = afterQuery.Take(limit);
                }

                var after = await afterQuery.ToListAsync();
                after.Reverse();

                content = [..after, ..before];
            }
        }

        return new PaginatedList<T>()
        {
            Content = content,
            Limit = limit,
            TotalRecord = totalRecord,
        };
    }
}

public static class GetMyChats
{
    public static async Task<Ok<PaginatedList<ChatDto>>> Handle(
        AppDbContext db,
        ChatMapper mapper,
        IUserAccessor userAccessor,
        string? cursor,
        CursorMode mode = CursorMode.Before,
        // string? search,
        // int? page,
        int limit = -1
    )
    {
        var user = await userAccessor.GetUserAsync();

        if (user is null)
        {
            throw new AuthenticationFailureException("User is unauthenticated");
        }

        var chats = await PaginationService.CreateAsync(db.Chats, ch => ch.CreatedAt, ch => ch.Id,
            CursorType.Decode(cursor), limit, mode);

        return TypedResults.Ok(new PaginatedList<ChatDto>()
        {
            Content = mapper.Map(chats.Content),
            Limit = chats.Limit,
            TotalRecord = chats.TotalRecord
        });

        // return TypedResults.Ok(mapper.Map(chats).ToList());

        // _ = db.Chats.OrderByDescending(expr);
        //
        // _ = db.Chats.Where(ch => ch.CreatedAt < DateTime.Now);

        // var query = db.Chats
        //     .Where(ch => ch.UserId == user.Id)
        //     .Include(ch => ch.User)
        //     .Include(ch => ch.Student)
        //     .Include(ch => ch.Messages
        //         .OrderByDescending(m => m.CreatedAt)
        //         .ThenByDescending(m => m.Id)
        //         .Take(1)
        //     )
        //     .OrderByDescending(ch => ch.Messages
        //         .OrderByDescending(m => m.CreatedAt)
        //         .ThenByDescending(m => m.Id)
        //         .First().CreatedAt
        //     )
        //     .AsSplitQuery();
        //
        // var filtered = Filter(query, search);
        // var paged = await PagedList<ChatDto>.CreateAsync(mapper.Map(filtered), page, limit);
        //
        // // TODO already accounted for in the Include but doesn't work for some reason
        // // need more testing to figure out why
        // foreach (var chat in paged.Content)
        // {
        //     chat.Messages = chat.Messages.Take(1);
        // }
        //
        // return TypedResults.Ok(paged);
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