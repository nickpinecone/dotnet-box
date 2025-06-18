using System;
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
using Polly;
using Polly.Retry;
using Telegram.Bot;

namespace News.Background;

public record DispatchCommand(int NewsletterId);

public class DispatchService : BackgroundService
{
    private readonly ITelegramBotClient _bot;
    private readonly Channel<DispatchCommand> _channel;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IFileStorage _fileStorage;
    private readonly ResiliencePipeline _pipeline;
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

        _pipeline = new ResiliencePipelineBuilder()
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

            var newsletter = await db.Newsletters
                .Include(n => n.Attachments)
                .Include(n => n.Messages)
                .AsSplitQuery()
                .FirstOrDefaultAsync(n => n.Id == command.NewsletterId, cancellationToken);

            if (newsletter == null) continue;

            foreach (var message in newsletter.Messages)
            {
                if (message.Status != Status.Lost || message.TgChatId is null) continue;

                await _pipeline.ExecuteAsync(async token =>
                {
                    try
                    {
                        var id = await SendToRecipient(newsletter, message, token);

                        message.TgMessageId = id;
                        message.Status = Status.Sent;

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
        }
    }

    private async Task<int> SendToRecipient(Newsletter newsletter, Models.Message message, CancellationToken token)
    {
        var sent = await _bot.SendMessage(message.TgChatId!, newsletter.Content, cancellationToken: token);

        return sent.Id;
    }
}