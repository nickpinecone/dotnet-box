using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Newleaf.Data;
using Newleaf.Features.Newsletters.DTOs;
using Newleaf.Infrastructure.Extensions;
using Newleaf.Infrastructure.Rest;
using Newleaf.Models;
using Riok.Mapperly.Abstractions;

public static partial class GetMessages
{
    public class Request(int id, StatusCode? status, ChannelCode? channel, int? page, int? limit)
    {
        public int Id { get; set; } = id;
        public StatusCode? Status { get; set; } = status;
        public ChannelCode? Channel { get; set; } = channel;

        public int Page { get; set; } = page ?? 1;
        public int Limit { get; set; } = limit ?? -1;
    }

    public static async Task<Ok<PagedList<MessageDto>>> Handle(
        AppDbContext db,
        Mapper mapper,
        // Parameters
        int id,
        StatusCode? status,
        ChannelCode? channel,
        int? page,
        int? limit
    )
    {
        var request = new Request(id, status, channel, page, limit);

        var query = db.Messages
            .Where(m => m.NewsletterId == request.Id)
            .AsSplitQuery();

        query = Filter(query, request);

        var paged = await PagedList<Message>.CreateAsync(query, request.Page, request.Limit);
        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }

    private static IQueryable<Message> Filter(IQueryable<Message> query, Request request)
    {
        if (request.Status is not null)
        {
            query = query.Where(i => i.Status == request.Status);
        }

        if (request.Channel is not null)
        {
            query = query.Where(i => i.Channel == request.Channel);
        }

        return query;
    }

    [Mapper]
    public partial class Mapper : IMapper
    {
        public partial MessageDto Map(Message message);
        public partial IEnumerable<MessageDto> Map(IEnumerable<Message> messages);
    }
}