using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace News.Infrastructure.Rest;

public class PagedList<T>
{
    public IEnumerable<T> Content { get; set; } = [];
    public required int PageNumber { get; init; }
    public required int PageSize { get; init; }
    public required int TotalRecord { get; init; }

    public int TotalPages => PageSize <= 0 ? 1 : (int)Math.Ceiling((float)TotalRecord / PageSize);
    public bool HasNextPage => PageSize != -1 && PageNumber * PageSize < TotalRecord;
    public bool HasPreviousPage => PageNumber > 1;

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> original, int? page, int? limit)
    {
        page ??= 1;
        page = Math.Max(1, (int)page);
        limit ??= -1;
        limit = Math.Max(-1, (int)limit);

        var totalCount = original.Count();
        var items = original;

        if (limit != -1)
        {
            items = original.Skip(((int)page - 1) * (int)limit).Take((int)limit);
        }
        else
        {
            page = 1;
        }

        return new PagedList<T>()
        {
            Content = await items.ToListAsync(),
            PageNumber = (int)page,
            PageSize = (int)limit,
            TotalRecord = totalCount,
        };
    }

    public PagedList<V> With<V>(IEnumerable<V> items)
    {
        return new PagedList<V>()
        {
            PageNumber = this.PageNumber,
            PageSize = this.PageSize,
            TotalRecord = this.TotalRecord,
            Content = items,
        };
    }
}