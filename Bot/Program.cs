using System;
using System.Threading;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace Bot;

public static class Program
{
    private static TelegramBotClient _bot = null!;
    
    public static async Task Main(string[] args)
    {
        using var cts = new CancellationTokenSource();
        _bot = new TelegramBotClient(Environment.GetEnvironmentVariable("BOT_TOKEN")!, cancellationToken: cts.Token);
        var me = await _bot.GetMe(cancellationToken: cts.Token);
        _bot.OnMessage += OnMessage;

        Console.WriteLine($"@{me.Username} is running... Press Enter to terminate");

        await new Task(() => {});
        await cts.CancelAsync();
    }
    
    private static async Task OnMessage(Message msg, UpdateType type)
    {
        if (msg.Text is null) return;
        
        Console.WriteLine($"Received {type} '{msg.Text}' in {msg.Chat}");
        await _bot.SendMessage(msg.Chat, $"{msg.From} said: {msg.Text}");
    }
}