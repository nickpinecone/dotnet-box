using System;
using System.Threading;
using System.Threading.Tasks;
using Api.Models;

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
}