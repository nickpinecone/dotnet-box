using System.Linq;
using Api.Features.Users.DTOs;
using Api.Infrastructure.Extensions;
using Api.Models;
using Riok.Mapperly.Abstractions;

namespace Api.Features.Users;

[Mapper]
public partial class UserMapper : IMapper
{
    public partial UserDto Map(User user);
    public partial IQueryable<UserDto> Map(IQueryable<User> users);
}
