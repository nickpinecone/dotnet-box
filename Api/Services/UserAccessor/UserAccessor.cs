using System.Threading.Tasks;
using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.UserAccessor;

public class UserAccessor : IUserAccessor
{
    private readonly AppDbContext _db;

    public UserAccessor(AppDbContext db)
    {
        _db = db;
    }

    public async Task<User?> GetUserAsync()
    {
        return await _db.Users.FirstOrDefaultAsync();
    }
}