namespace Newleaf.Models;

public enum StatusCode
{
    lost,
    sent,
}

public enum ChannelCode
{
    none,
    telegram,
    email,
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