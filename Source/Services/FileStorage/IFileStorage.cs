using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using AppName.Models;
using Microsoft.AspNetCore.Http;

namespace AppName.Services.FileStorage;

public class FileStorageOptions
{
    public required string BucketName { get; set; }
}

public interface IFileStorage
{
    public Task<Guid> UploadAsync(Stream stream, string contentType, CancellationToken cancellationToken = default);

    public Task<Stream?> DownloadAsync(Guid fileId, CancellationToken cancellationToken = default);

    public Task DeleteAsync(Guid fileId, CancellationToken cancellationToken = default);

    public Task<List<Attachment>> ToAttachmentsAsync(IFormFileCollection? files, CancellationToken cancellationToken = default);
}