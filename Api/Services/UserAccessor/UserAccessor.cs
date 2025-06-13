using System.Threading.Tasks;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

namespace Api.Services.UserAccessor;

public class UserAccessor : IUserAccessor
{
    private readonly AppDbContext _db;

    public UserAccessor(AppDbContext db)
    {
        _db = db;
    }

    public async Task<User> GetUserAsync()
    {
        var user = await _db.Users.FirstOrDefaultAsync();
        
        if (user is null)
        {
            throw new AuthenticationFailureException("User is unauthenticated");
        }

        return user;
    }
}