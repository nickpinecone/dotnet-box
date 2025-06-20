using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newleaf.Data;
using Newleaf.Features.Attachments.DTOs;
using Newleaf.Features.Newsletters;
using Newleaf.Features.Newsletters.DTOs;
using Newleaf.Infrastructure.Extensions;
using Newleaf.Models;
using Riok.Mapperly.Abstractions;

public static partial class GetNewsletterById
{
    public class Response
    {
        public int Id { get; set; }

        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }

        public IEnumerable<AttachmentDto> Attachments { get; set; } = [];
        public IEnumerable<MessageDto> Messages { get; set; } = [];
    }

    public static async Task<Results<Ok<Response>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        Mapper mapper,
        // Parameters
        int id
    )
    {
        var newsletter = await db.Newsletters
            .Include(n => n.Attachments)
            .Include(n => n.Messages.Take(10))
            .AsSplitQuery()
            .FirstOrDefaultAsync(n => n.Id == id);

        if (newsletter is null)
        {
            return Result.Fail(NewsletterErrors.NotFound(id)).ToNotFoundProblem();
        }

        var mapped = mapper.Map(newsletter);
        return TypedResults.Ok(mapped);
    }

    [Mapper]
    public partial class Mapper : IMapper
    {
        public partial Response Map(Newsletter newsletter);
    }
}