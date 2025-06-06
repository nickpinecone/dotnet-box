using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace Api.Services.FileStorage;

public class MinioStorage : IFileStorage
{
    private readonly string _bucketName;
    private readonly IMinioClient _minioClient;

    public MinioStorage(IOptions<FileStorageOptions> options, IMinioClient minioClient)
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

    public async Task<Attachment> UploadAsync(BlobData data, CancellationToken cancellationToken = default)
    {
        await CreateBucketIfNotExists();

        var blobId = Guid.NewGuid();

        var nameBytes = Encoding.UTF8.GetBytes(data.Name);
        var name = Convert.ToBase64String(nameBytes);

        var putArgs = new PutObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(blobId.ToString())
            .WithStreamData(data.Stream)
            .WithObjectSize(data.Stream.Length)
            .WithContentType(data.ContentType)
            .WithHeaders(new Dictionary<string, string>()
            {
                { "x-amz-meta-name", name},
            });

        await _minioClient.PutObjectAsync(putArgs, cancellationToken);

        return new Attachment()
        {
            BlobId = blobId,
            MimeType = data.ContentType,
            Name = data.Name,
            CreatedAt = DateTime.UtcNow,
        };
    }

    public async Task<BlobData?> DownloadAsync(Guid fileId, CancellationToken cancellationToken = default)
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

            var response = await _minioClient.GetObjectAsync(getArgs, cancellationToken);
            await task.Task;

            var nameBytes = Convert.FromBase64String(response.MetaData["name"]);
            var name = Encoding.UTF8.GetString(nameBytes);

            stream.Seek(0, SeekOrigin.Begin);

            return new BlobData()
            {
                Stream = stream,
                ContentType = response.ContentType,
                Name = name
            };
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
}