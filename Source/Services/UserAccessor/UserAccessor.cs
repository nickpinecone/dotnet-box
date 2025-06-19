using System.Threading.Tasks;
using News.Data;

namespace News.Services.UserAccessor;

public class UserAccessor : IUserAccessor
{
    private readonly AppDbContext _db;

    public UserAccessor(AppDbContext db)
    {
        _db = db;
    }

    public Task<User?> GetUserAsync()
    {
        return Task.FromResult<User?>(new User()
        {
            Email = "admin@example.com",
            Id = 0
        });
    }
}