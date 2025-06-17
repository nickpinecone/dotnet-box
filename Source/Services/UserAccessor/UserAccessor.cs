using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using News.Data;
using News.Models;

namespace News.Services.UserAccessor;

public class UserAccessor : IUserAccessor
{
    private readonly AppDbContext _db;

    public UserAccessor(AppDbContext db)
    {
        _db = db;
    }

    public Task<User> GetUserAsync()
    {
        return Task.FromResult(new User()
        {
            Email = "",
            Id = 0
        });
        // var user = await _db.Users.FirstOrDefaultAsync();
        //
        // if (user is null)
        // {
        //     throw new AuthenticationFailureException("User is unauthenticated");
        // }
        //
        // return user;
    }
}