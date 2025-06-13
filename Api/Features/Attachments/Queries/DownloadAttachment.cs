using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Infrastructure.Extensions;
using Api.Services.FileStorage;
using Api.Services.UserAccessor;
using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Attachments.Queries;

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
        var user = await userAccessor.GetUserAsync();
        
        var attachment = await db.Attachments
            .Include(a => a.Chat)
            .Where(a => a.Chat!.UserId == user.Id)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (attachment is null)
        {
            return Result.Fail(AttachmentErrors.NotFound(id)).ToNotFoundProblem();
        }
        
        var data = await fileStorage.DownloadAsync(attachment.BlobId);

        if (data is null)
        {
            return Result.Fail(AttachmentErrors.DownloadFailed(id)).ToNotFoundProblem();
        }

        return TypedResults.File(data.Stream, data.ContentType, data.Name);
    }
}