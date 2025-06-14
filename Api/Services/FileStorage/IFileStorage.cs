using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.AspNetCore.Http;

namespace Api.Services.FileStorage;

public class FileStorageOptions
{
    public required string BucketName { get; set; }
}

public interface IFileStorage
{
    public Task<BlobResponse> UploadAsync(BlobData data, CancellationToken cancellationToken = default);

    public Task<BlobData?> DownloadAsync(Guid fileId, CancellationToken cancellationToken = default);

    public Task DeleteAsync(Guid fileId, CancellationToken cancellationToken = default);

    public Task<List<Attachment>> ToAttachmentsAsync(IFormFileCollection files, int chatId, CancellationToken cancellationToken = default);
}