using System;
using System.Collections.Generic;

namespace News.Models;

public enum Frequency
{
    once,
    every_day,
    every_week,
    every_month,
    every_quarter,
    every_year,
    custom,
}

public class Template
{
    public int Id { get; set; }
    public required string Content { get; set; }
    
    public required DateTime DelayedTo { get; set; }
    public required Frequency Frequency { get; set; }
    public TimeSpan? FrequencySpan { get; set; }
    
    public ICollection<int> StudentIds { get; set; } = [];
    public ICollection<Attachment> Attachments { get; set; } = [];
}
