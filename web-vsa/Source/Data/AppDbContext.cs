using Microsoft.EntityFrameworkCore;
using WebVsa.Models;

namespace WebVsa.Data;

public class AppDbContext : DbContext
{
    public DbSet<Attachment> Attachments => Set<Attachment>();
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
}
