namespace News.Models;

public enum StatusCode
{
    Lost,
    Sent,
}

public enum ChannelCode
{
    Telegram,
    Email,
}

public class Message
{
    public int Id { get; set; }

    public required int StudentId { get; set; }
    public required StatusCode Status { get; set; }
    public ChannelCode Channel { get; set; }

    public required int NewsletterId { get; set; }
    public Newsletter? Newsletter { get; set; }
}