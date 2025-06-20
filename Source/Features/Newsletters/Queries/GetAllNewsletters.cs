using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using News.Data;
using News.Features.Attachments.DTOs;
using News.Features.Newsletters.DTOs;
using News.Infrastructure.Extensions;
using News.Infrastructure.Rest;
using News.Models;
using Riok.Mapperly.Abstractions;

namespace News.Features.Newsletters.Queries;

public static partial class GetAllNewsletters
{
    public class Response
    {
        public int Id { get; set; }

        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }

        public IEnumerable<AttachmentDto> Attachments { get; set; } = [];
        public IEnumerable<MessageDto> Messages { get; set; } = [];
    }

    public class Request(string? search, StatusCode? status, int? page, int? limit)
    {
        public string Search { get; set; } = search ?? "";
        public StatusCode? Status { get; set; } = status;

        public int Page { get; set; } = page ?? 1;
        public int Limit { get; set; } = limit ?? -1;
    }

    public static async Task<Ok<PagedList<Response>>> Handle(
        AppDbContext db,
        Mapper mapper,
        // Parameters
        string? search,
        StatusCode? status,
        int? page,
        int? limit
    )
    {
        var request = new Request(search, status, page, limit);

        var query = db.Newsletters
            .Include(n => n.Attachments)
            .Include(n => n.Messages.Take(10))
            .AsSplitQuery();

        query = Filter(query, request);

        var paged = await PagedList<Newsletter>.CreateAsync(query, request.Page, request.Limit);
        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }

    private static IQueryable<Newsletter> Filter(IQueryable<Newsletter> query, Request request)
    {
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query
                .Where(i =>
                    i.Content.ToLower().Contains(request.Search.ToLower()) ||
                    i.Attachments.Any(a => a.Name.ToLower().Contains(request.Search.ToLower()))
                );
        }

        if (request.Status is not null)
        {
            if (request.Status == StatusCode.lost)
            {
                query = query
                    .Where(n => n.Messages.Any(m => m.Status == StatusCode.lost));
            }
            else
            {
                query = query
                    .Where(n => n.Messages.All(m => m.Status == StatusCode.sent));
            }
        }

        return query;
    }

    [Mapper]
    public partial class Mapper : IMapper
    {
        public partial Response Map(Newsletter newsletter);
        public partial IEnumerable<Response> Map(IEnumerable<Newsletter> newsletters);
    }
}