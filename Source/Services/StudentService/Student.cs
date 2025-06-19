namespace News.Services.StudentService;

public class Student
{
    public int Id { get; set; }
    
    public required string Email { get; set; }
    public int? TelegramId { get; set; }
}