using System.Threading.Tasks;

namespace Newleaf.Services.UserAccessor;

public interface IUserAccessor
{
    public Task<User?> GetUserAsync();
}