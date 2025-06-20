using System.Threading.Tasks;
using Newleaf.Data;

namespace Newleaf.Services.UserAccessor;

public class UserAccessor : IUserAccessor
{
    private readonly AppDbContext _db;

    public UserAccessor(AppDbContext db)
    {
        _db = db;
    }

    // TODO grab user from the auth service
    public Task<User?> GetUserAsync()
    {
        return Task.FromResult<User?>(new User()
        {
            Email = "admin@example.com",
            Id = 0
        });
    }
}