using System.Threading.Tasks;
using News.Models;

namespace News.Services.UserAccessor;

public interface IUserAccessor
{
    public Task<User> GetUserAsync();
}