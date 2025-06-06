using System.Linq;
using System.Text.Json.Serialization;
using Api.Data;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Rest;
using Api.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Students;

public class StudentRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        app.MapGet("/students", async (AppDbContext db, StudentMapper mapper, string? search, int? page, int? limit) =>
            {
                var filtered = Filter(db.Students, search);
                var paged = await PagedList<StudentDto>.CreateAsync(mapper.Map(filtered), page, limit);

                return TypedResults.Ok(paged);
            })
            .WithTags("Студенты");
    }

    public static IQueryable<Student> Filter(IQueryable<Student> students, string? search)
    {
        if (!string.IsNullOrEmpty(search))
        {
            students = students
                .Where(s => s.Email.ToLower().Contains(search));
        }

        return students;
    }
}