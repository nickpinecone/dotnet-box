using System.Threading.Tasks;

namespace News.Services.UserAccessor;

public interface IUserAccessor
{
    public Task<User?> GetUserAsync();
}