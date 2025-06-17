using System.Threading.Tasks;
using FluentResults;
using Microsoft.AspNetCore.Http;
using News.Models;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Message = News.Models.Message;

namespace News.Services.BotService;

public class BotService : IBotService
{
    private readonly ITelegramBotClient _bot;

    public BotService(ITelegramBotClient bot)
    {
        _bot = bot;
    }

    public async Task<Result<int>> SendAsync(int chatId, string content, IFormFileCollection? files)
    {
        var sent = await _bot.SendMessage(chatId, content);

        return sent.Id;
    }

    public Task<Result> EditAsync(int chatId, int messageId, string content)
    {
        throw new System.NotImplementedException();
    }

    public Task<Result> DeleteAsync(int chatId, int messageId)
    {
        throw new System.NotImplementedException();
    }
}