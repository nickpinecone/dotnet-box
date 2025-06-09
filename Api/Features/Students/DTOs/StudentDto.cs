namespace Api.Features.Students.DTOs;

public class StudentDto
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string TelegramId { get; set; }
}