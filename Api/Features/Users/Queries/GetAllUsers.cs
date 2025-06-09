using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Users.DTOs;
using Api.Infrastructure.Rest;
using Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Api.Features.Users.Queries;

public static class GetAllUsers
{
    public static async Task<Ok<PagedList<UserDto>>> Handle(
        AppDbContext db,
        UserMapper mapper,
        string? search,
        int? page,
        int? limit)
    {
        var filtered = Filter(db.Users, search);
        var paged = await PagedList<UserDto>.CreateAsync(mapper.Map(filtered), page, limit);

        return TypedResults.Ok(paged);
    }

    private static IQueryable<User> Filter(IQueryable<User> items, string? search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            items = items
                .Where(i => i.Email.ToLower().Contains(search));
        }

        return items;
    }
}