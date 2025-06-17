namespace News.Models;

public enum Status
{
    Lost,
    Sent,
    Read,
}

public class Message
{
    public int Id { get; set; }
    
    public int? TgChatId { get; set; }
    public int? TgMessageId { get; set; }
    public required int StudentId { get; set; }
    public required Status Status { get; set; }
}