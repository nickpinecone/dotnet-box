using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Attachments.DTOs;
using Api.Features.Students;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Rest;
using Api.Models;
using Api.Services.UserAccessor;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Attachments.Queries;

public static class GetAttachments
{
    public record Request(int? StudentId, CursorType? Cursor, string? Search, CursorMode Mode, int Limit);
    
    public class Validator : AbstractValidator<Request>
    {
        public Validator(AppDbContext db)
        {
            RuleFor(x => x.StudentId)
                .MustAsync(async (id, cancellation) =>
                {
                    if (id is null)
                    {
                        return true;
                    }
                    
                    var student = await db.Students.FirstOrDefaultAsync(s => s.Id == id, cancellation);
                    return student != null;
                })
                .WithMessage(StudentErrors.NotFound());
        }
    }
    
    public static async Task<Results<Ok<PaginatedList<AttachmentDto>>, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        AttachmentMapper mapper,
        IUserAccessor userAccessor,
        IValidator<Request> validator,
        // Parameters
        [FromQuery(Name = "student_id")] int? studentId,
        CursorType? cursor,
        string? search,
        CursorMode mode = CursorMode.before,
        int limit = -1
    )
    {
        var request = new Request(studentId, cursor, search, mode, limit);
        var user = await userAccessor.GetUserAsync();
        var validation = await validator.ValidateAsync(request);

        if (!validation.IsValid)
        {
            return validation.ToNotFoundProblem();
        }

        var query = db.Attachments
            .Include(a => a.Chat)
            .AsSplitQuery();

        query = request.StudentId is null
            ? query.Where(m => m.Chat!.UserId == user.Id)
            : query.Where(m => m.Chat!.UserId == user.Id && m.Chat.StudentId == request.StudentId);

        query = Filter(query, request);

        var paged = await PaginationService.CreateAsync(
            query,
            a => a.CreatedAt,
            a => a.Id,
            request.Cursor, request.Limit, request.Mode
        );

        var mapped = paged.With(mapper.Map(paged.Content));

        return TypedResults.Ok(mapped);
    }

    private static IQueryable<Attachment> Filter(IQueryable<Attachment> query, Request request)
    {
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query
                .Where(i => i.Name.ToLower().Contains(request.Search.ToLower()));
        }

        return query;
    }
}