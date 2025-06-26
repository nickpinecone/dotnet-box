using Microsoft.EntityFrameworkCore;

namespace AppName.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
}