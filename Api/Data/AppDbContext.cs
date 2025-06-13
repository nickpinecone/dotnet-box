using System;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    
    public DbSet<Chat> Chats => Set<Chat>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasData(new User()
        {
            Id = -1,
            Email = "user@example.com",
        });

        modelBuilder.Entity<Student>().HasData(new Student()
        {
            Id = -1,
            Email = "student@example.com",
            TelegramId = "592566902",
        });
        
        modelBuilder.Entity<Chat>().HasData(new Chat()
        {
            Id = -1,
            CreatedAt = DateTime.MinValue,
            StudentId = -1,
            UserId = -1,
            UnreadCount = 0,
        });
        
        modelBuilder.Entity<Message>().HasData(new Message()
        {
            Id = -1,
            CreatedAt = DateTime.MinValue,
            StudentId = -1,
            Content = "Test 1",
            ChatId = -1,
            IsRead = false,
            TelegramId = 0,
        });
        
        modelBuilder.Entity<Message>().HasData(new Message()
        {
            Id = -2,
            CreatedAt = DateTime.MinValue,
            UserId = -1,
            Content = "Test 2",
            ChatId = -1,
            IsRead = false,
            TelegramId = 1,
        });
        
        modelBuilder.Entity<Message>().HasData(new Message()
        {
            Id = -3,
            CreatedAt = DateTime.MinValue,
            UserId = -1,
            Content = "Test 3",
            ChatId = -1,
            IsRead = false,
            TelegramId = 1,
        });
        
        modelBuilder.Entity<Message>().HasData(new Message()
        {
            Id = -4,
            CreatedAt = DateTime.MinValue,
            UserId = -1,
            Content = "Test 4",
            ChatId = -1,
            IsRead = false,
            TelegramId = 1,
        });
        
        modelBuilder.Entity<Message>().HasData(new Message()
        {
            Id = -5,
            CreatedAt = DateTime.MinValue,
            UserId = -1,
            Content = "Test 5",
            ChatId = -1,
            IsRead = false,
            TelegramId = 1,
        });
    }
}