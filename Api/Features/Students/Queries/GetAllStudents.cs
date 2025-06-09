using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.Features.Students.DTOs;
using Api.Infrastructure.Rest;
using Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Api.Features.Students.Queries;

public static class GetAllStudents
{
    public static async Task<Ok<PagedList<StudentDto>>> Handle(
        AppDbContext db,
        StudentMapper mapper,
        string? search,
        int? page,
        int? limit)
    {
        var filtered = Filter(db.Students, search);
        var paged = await PagedList<StudentDto>.CreateAsync(mapper.Map(filtered), page, limit);

        return TypedResults.Ok(paged);
    }

    private static IQueryable<Student> Filter(IQueryable<Student> items, string? search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            items = items
                .Where(i => i.Email.ToLower().Contains(search));
        }

        return items;
    }
}