using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using Newleaf.Models;

namespace Newleaf.Services.FileStorage;

public class FileStorage : IFileStorage
{
    private readonly string _bucketName;
    private readonly IMinioClient _minioClient;

    public FileStorage(IOptions<FileStorageOptions> options, IMinioClient minioClient)
    {
        _minioClient = minioClient;
        _bucketName = options.Value.BucketName;
    }

    private async Task CreateBucketIfNotExists()
    {
        var existsArgs = new BucketExistsArgs()
            .WithBucket(_bucketName);

        var found = await _minioClient.BucketExistsAsync(existsArgs);

        if (!found)
        {
            var makeArgs = new MakeBucketArgs()
                .WithBucket(_bucketName);

            await _minioClient.MakeBucketAsync(makeArgs);
        }
    }

    public async Task<Guid> UploadAsync(Stream stream, string contentType,
        CancellationToken cancellationToken = default)
    {
        await CreateBucketIfNotExists();

        var blobId = Guid.NewGuid();

        var putArgs = new PutObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(blobId.ToString())
            .WithStreamData(stream)
            .WithObjectSize(stream.Length)
            .WithContentType(contentType);

        await _minioClient.PutObjectAsync(putArgs, cancellationToken);

        return blobId;
    }

    public async Task<Stream?> DownloadAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        var stream = new MemoryStream();
        var task = new TaskCompletionSource<bool>();

        try
        {
            var getArgs = new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(fileId.ToString())
                .WithCallbackStream(cbStream =>
                {
                    cbStream.CopyTo(stream);
                    task.SetResult(true);
                });

            await _minioClient.GetObjectAsync(getArgs, cancellationToken);
            await task.Task;
            stream.Seek(0, SeekOrigin.Begin);

            return stream;
        }
        catch
        {
            return null;
        }
    }

    public async Task DeleteAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        var deleteArgs = new RemoveObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(fileId.ToString());

        await _minioClient.RemoveObjectAsync(deleteArgs, cancellationToken);
    }

    public async Task<List<Attachment>> ToAttachmentsAsync(IFormFileCollection? files,
        CancellationToken cancellationToken = default)
    {
        var attachments = new List<Attachment>();

        if (files is not null && files.Count > 0)
        {
            foreach (var file in files)
            {
                await using var stream = file.OpenReadStream();
                var blobId = await UploadAsync(stream, file.ContentType, cancellationToken: cancellationToken);

                var attachment = new Attachment()
                {
                    Name = file.FileName,
                    BlobId = blobId,
                    CreatedAt = DateTime.UtcNow,
                    MimeType = file.ContentType,
                };

                attachments.Add(attachment);
            }
        }

        return attachments;
    }
}