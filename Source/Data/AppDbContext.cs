using Microsoft.EntityFrameworkCore;
using News.Models;

namespace News.Data;

public class AppDbContext : DbContext
{
    public DbSet<Newsletter> Newsletters => Set<Newsletter>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Template> Templates => Set<Template>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
}