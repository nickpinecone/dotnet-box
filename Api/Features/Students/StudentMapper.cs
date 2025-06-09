using System.Collections.Generic;
using System.Linq;
using Api.Features.Students.DTOs;
using Api.Infrastructure.Extensions;
using Api.Models;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Students;

[Mapper]
public partial class StudentMapper : IMapper
{
    public partial StudentDto Map(Student student);
    public partial IQueryable<StudentDto> Map(IQueryable<Student> students);
}