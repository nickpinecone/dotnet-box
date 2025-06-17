using System.Threading.Tasks;
using FluentResults;
using Microsoft.AspNetCore.Http;
using News.Models;

namespace News.Services.BotService;

public interface IBotService
{
    public Task<Result<int>> SendAsync(int chatId, string content, IFormFileCollection? files);

    public Task<Result> EditAsync(int chatId, int messageId, string content);
    
    public Task<Result> DeleteAsync(int chatId, int messageId);
}