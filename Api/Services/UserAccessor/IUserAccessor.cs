using System.Threading.Tasks;
using Api.Models;

namespace Api.Services.UserAccessor;

public interface IUserAccessor
{
    public Task<User> GetUserAsync();
}