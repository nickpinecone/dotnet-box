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

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> original, int? page, int? pageSize)
    {
        page ??= 1;
        page = Math.Max(1, (int)page);
        pageSize ??= -1;
        pageSize = Math.Max(-1, (int)pageSize);

        var totalCount = original.Count();
        var items = original;

        if (pageSize != -1)
        {
            items = original.Skip(((int)page - 1) * (int)pageSize).Take((int)pageSize);
        }
        else
        {
            page = 1;
        }

        return new PagedList<T>()
        {
            Content = await items.ToListAsync(),
            PageNumber = (int)page,
            PageSize = (int)pageSize,
            TotalRecord = totalCount,
        };
    }
}