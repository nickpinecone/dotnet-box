using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Api.Infrastructure.Rest;

// TODO add HasBefore and HasAfter in the future
public class PaginatedList<T>
{
    public IEnumerable<T> Content { get; set; } = [];
    public int Limit { get; set; }
    public int TotalRecord { get; set; }

    public PaginatedList<V> With<V>(IEnumerable<V> content)
    {
        return new PaginatedList<V>()
        {
            Content = content,
            Limit = this.Limit,
            TotalRecord = this.TotalRecord,
        };
    }
}

public static class PaginationService
{
    public static async Task<PaginatedList<T>> CreateAsync<T>(IQueryable<T> original,
        Expression<Func<T, DateTime>> timestampExpr, Expression<Func<T, int>> idExpr,
        CursorType? cursor, int limit,
        CursorMode mode
    )
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
            if (mode == CursorMode.before)
            {
                content = await GetBefore(original, timestampExpr, idExpr, cursor, limit);
            }
            else if (mode == CursorMode.after)
            {
                content = await GetAfter(original, timestampExpr, idExpr, cursor, limit);
            }
            else
            {
                var before = await GetBefore(original, timestampExpr, idExpr, cursor, limit);
                var after = await GetAfter(original, timestampExpr, idExpr, cursor, limit + 1, true);
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

    private static (ParameterExpression param, MemberExpression timestampProp, MemberExpression idProp)
        GetProperties<T>(
            Expression<Func<T, DateTime>> timestampExpr, Expression<Func<T, int>> idExpr)
    {
        var param = timestampExpr.Parameters[0];
        var timestampMember = ((MemberExpression)timestampExpr.Body).Member.Name;
        var idMember = ((MemberExpression)idExpr.Body).Member.Name;

        var timestampProp = Expression.Property(param, timestampMember);
        var idProp = Expression.Property(param, idMember);

        return (param, timestampProp, idProp);
    }

    private static async Task<List<T>> GetBefore<T>(IQueryable<T> original,
        Expression<Func<T, DateTime>> timestampExpr, Expression<Func<T, int>> idExpr,
        CursorType cursor, int limit)
    {
        var (param, timestampProp, idProp) = GetProperties(timestampExpr, idExpr);

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

        return await original.ToListAsync();
    }

    private static async Task<List<T>> GetAfter<T>(IQueryable<T> original,
        Expression<Func<T, DateTime>> timestampExpr, Expression<Func<T, int>> idExpr,
        CursorType cursor, int limit, bool includeSelf = false)
    {
        var (param, timestampProp, idProp) = GetProperties(timestampExpr, idExpr);

        var expression = Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(
                Expression.GreaterThanOrEqual(timestampProp, Expression.Constant(cursor.Timestamp)),
                includeSelf
                    ? Expression.GreaterThanOrEqual(idProp, Expression.Constant(cursor.Id))
                    : Expression.GreaterThan(idProp, Expression.Constant(cursor.Id))
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

        var content = await original.ToListAsync();
        content.Reverse();

        return content;
    }
}