using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Channels;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using News.Data;
using News.Models;
using News.Services.FileStorage;
using News.Services.StudentService;
using Polly;
using Polly.Retry;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace News.Background;

public record DispatchCommand(int NewsletterId);

public interface IDispatchService
{
    public Task Enqueue(DispatchCommand command);
}

public class DispatchService : BackgroundService, IDispatchService
{
    private readonly ITelegramBotClient _bot;
    private readonly Channel<DispatchCommand> _channel;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IFileStorage _fileStorage;
    private readonly ResiliencePipeline _rateLimiter;
    private readonly ILogger<DispatchService> _logger;

    public DispatchService(
        IServiceScopeFactory scopeFactory,
        ITelegramBotClient bot,
        Channel<DispatchCommand> channel,
        IFileStorage fileStorage,
        ILogger<DispatchService> logger)
    {
        _scopeFactory = scopeFactory;
        _bot = bot;
        _channel = channel;
        _fileStorage = fileStorage;
        _logger = logger;

        _rateLimiter = new ResiliencePipelineBuilder()
            .AddRateLimiter(new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions()
            {
                Window = TimeSpan.FromSeconds(1),
                PermitLimit = 25,
            }))
            .AddRetry(new RetryStrategyOptions
            {
                ShouldHandle = new PredicateBuilder()
                    .Handle<Exception>(ex => ex is not DbUpdateConcurrencyException),
                MaxRetryAttempts = 3,
                Delay = TimeSpan.FromSeconds(1)
            })
            .Build();
    }

    public async Task Enqueue(DispatchCommand command)
    {
        await _channel.Writer.WriteAsync(command);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        await foreach (var command in _channel.Reader.ReadAllAsync(cancellationToken))
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var studentService = scope.ServiceProvider.GetRequiredService<IStudentService>();

            var newsletter = await db.Newsletters
                .Include(n => n.Attachments)
                .Include(n => n.Messages)
                .AsSplitQuery()
                .FirstOrDefaultAsync(n => n.Id == command.NewsletterId, cancellationToken);

            if (newsletter == null) continue;

            var streams = new Dictionary<int, Stream?>();

            foreach (var attachment in newsletter.Attachments)
            {
                var stream = await _fileStorage.DownloadAsync(attachment.BlobId, cancellationToken);
                streams.Add(attachment.Id, stream);
            }

            // TODO fallback to email if cant send to telegram
            foreach (var message in newsletter.Messages)
            {
                var student = await studentService.GetStudentAsync(message.StudentId);

                if (message.Status != StatusCode.lost || student?.TelegramId is null)
                {
                    continue;
                }

                await _rateLimiter.ExecuteAsync(async token =>
                {
                    try
                    {
                        await SendByTelegram(newsletter, streams, (int)student.TelegramId, token);

                        message.Status = StatusCode.sent;
                        message.Channel = ChannelCode.telegram;

                        await db.SaveChangesAsync(token);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(
                            "Failed to send message to {}, with message {}",
                            message.StudentId,
                            ex.Message
                        );

                        throw;
                    }
                }, cancellationToken);
            }

            foreach (var stream in streams.Values)
            {
                if (stream is not null)
                {
                    await stream.DisposeAsync();
                }
            }
        }
    }

    private async Task SendByTelegram(Newsletter newsletter, Dictionary<int, Stream?> streams, int chatId,
        CancellationToken token)
    {
        if (newsletter.Attachments.Count > 0)
        {
            var album = new List<IAlbumInputMedia>();

            for (var i = 0; i < newsletter.Attachments.Count; i++)
            {
                var attachment = newsletter.Attachments.ElementAt(i);
                var stream = streams[attachment.Id];

                if (stream is null) continue;

                var document = new InputMediaDocument(new InputFileStream(stream, attachment.Name));

                if (i == newsletter.Attachments.Count - 1)
                {
                    document.Caption = newsletter.Content;
                }

                album.Add(document);
            }

            await _bot.SendMediaGroup(chatId, album, cancellationToken: token);
        }
        else
        {
            await _bot.SendMessage(chatId, newsletter.Content, cancellationToken: token);
        }
    }
}