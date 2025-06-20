using System.Threading.Tasks;
using News.Infrastructure.Extensions;
using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using News.Data;
using News.Services.FileStorage;
using News.Services.UserAccessor;

namespace News.Features.Attachments.Queries;

public static class DownloadAttachment
{
    public static async Task<Results<FileStreamHttpResult, NotFound<ProblemDetails>>> Handle(
        AppDbContext db,
        IFileStorage fileStorage,
        IUserAccessor userAccessor,
        // Parameters
        int id
    )
    {
        await userAccessor.GetUserAsync();

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