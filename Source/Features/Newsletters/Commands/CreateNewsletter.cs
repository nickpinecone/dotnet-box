using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using News.Background;
using News.Data;
using News.Features.Attachments.DTOs;
using News.Infrastructure.Extensions;
using News.Models;
using News.Services.FileStorage;

namespace News.Features.Newsletters.Commands;

public static class CreateNewsletter
{
    public class Response
    {
        public int Id { get; set; }

        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }

        public IEnumerable<AttachmentDto> Attachments { get; set; } = [];
    }

    public class Request(string content, int[] studentIds, IFormFileCollection? files)
    {
        public string Content { get; set; } = content;
        public int[] StudentIds { get; set; } = studentIds;
        public IFormFileCollection? Files { get; set; } = files;
    }

    public class Validator : AbstractValidator<Request>
    {
        public Validator()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .When(x => !x.Files?.Any() ?? true)
                .WithMessage(NewsletterErrors.Empty());

            RuleFor(x => x.StudentIds)
                .NotEmpty()
                .WithName("Студенты")
                .WithMessage(NewsletterErrors.NoRecipients());
        }
    }

    public static async Task<Results<Ok<Response>, BadRequest<ProblemDetails>>> Handle(
        AppDbContext db,
        IFileStorage fileStorage,
        IValidator<Request> validator,
        IDispatchService dispatch,
        NewsletterMapper mapper,
        // Parameters
        [FromQuery(Name = "student_ids")] int[] studentIds,
        [FromQuery(Name = "content")] string content,
        [FromForm] IFormFileCollection? files = null
    )
    {
        var request = new Request(content, studentIds, files);

        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            return validation.ToBadRequestProblem();
        }

        var newsletter = new Newsletter()
        {
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            Attachments = await fileStorage.ToAttachmentsAsync(request.Files),
        };

        await db.Newsletters.AddAsync(newsletter);
        await db.SaveChangesAsync();

        foreach (var studentId in request.StudentIds)
        {
            var message = new Message()
            {
                Status = StatusCode.Lost,
                NewsletterId = newsletter.Id,
                StudentId = studentId,
            };
            
            newsletter.Messages.Add(message);
        }
        
        await db.SaveChangesAsync();
        await dispatch.Enqueue(new DispatchCommand(newsletter.Id));

        var mapped = mapper.Map(newsletter);
        return TypedResults.Ok(mapped);
    }
}