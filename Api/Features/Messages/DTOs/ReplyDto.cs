namespace Api.Features.Messages.DTOs;

public class ReplyDto
{
    public int Id { get; set; }
    public required int TelegramId { get; set; }
}