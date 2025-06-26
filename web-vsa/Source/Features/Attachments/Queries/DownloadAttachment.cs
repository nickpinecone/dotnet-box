using System.Threading.Tasks;
using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebVsa.Data;
using WebVsa.Infrastructure.Extensions;
using WebVsa.Services.FileStorage;

namespace WebVsa.Features.Attachments.Queries;

public static class DownloadAttachment
{
    public static async Task<Results<FileStreamHttpResult, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        IFileStorage fileStorage,
        int id
    )
    {
        var attachment = await db.Attachments.FirstOrDefaultAsync(a => a.Id == id);

        if (attachment is null)
        {
            return Result.Fail(AttachmentErrors.NotFound(id)).ToNotFoundProblem();
        }

        var data = await fileStorage.DownloadAsync(attachment.BlobId);

        if (data is null)
        {
            return Result.Fail(AttachmentErrors.DownloadFailed(id)).ToNotFoundProblem();
        }

        return TypedResults.File(data, attachment.MimeType, attachment.Name);
    }
}