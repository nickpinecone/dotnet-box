using System.Collections.Generic;
using System.Linq;
using Api.Infrastructure.Extensions;
using Api.Models;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Students;

public class StudentDto
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string TelegramId { get; set; }
}

[Mapper]
public partial class StudentMapper : IMapper
{
    public partial StudentDto Map(Student student);
    public partial IQueryable<StudentDto> Map(IQueryable<Student> students);
}