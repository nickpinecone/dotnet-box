using Newleaf.Models;

namespace Newleaf.Features.Newsletters.DTOs;

public class MessageDto
{
    public int Id { get; set; }

    public required int StudentId { get; set; }
    public required StatusCode Status { get; set; }
    public ChannelCode Channel { get; set; }

    public required int NewsletterId { get; set; }
}