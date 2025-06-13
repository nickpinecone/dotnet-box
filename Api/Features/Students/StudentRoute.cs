using Api.Features.Students.Queries;
using Api.Infrastructure.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Api.Features.Students;

public class StudentRoute : IRoute
{
    public void MapRoutes(WebApplication app)
    {
        app.MapGet("/students/all", GetAllStudents.Handle)
            .WithTags("Студенты");
    }
}