using System.Threading.Tasks;
using Api.Models;
using FluentResults;

namespace Api.Services.BotService;

public interface IBotService
{
    public Task<Result<int>> SendMessageAsync(Message message);

    public Task<Result> EditMessageAsync(Message message);

    public Task<Result> DeleteMessageAsync(Message message);
}