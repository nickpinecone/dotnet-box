using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext : DbContext
{
    public DbSet<Attachment> Attachments => Set<Attachment>();
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
}