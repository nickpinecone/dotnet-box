using System;
using System.Collections.Generic;

namespace News.Models;

public class Newsletter
{
    public int Id { get; set; }
    
    public required string Content { get; set; }
    public required DateTime CreatedAt { get; set; }
    
    public ICollection<Message> Messages { get; set; } = [];
    public ICollection<Attachment> Attachments { get; set; } = [];
}

// TODO potential solve for when the number of students inside of these gets updated
// public enum TargetType
// {
//     Single,
//     AcademyGroup,
//     CourseYear,
//     Speciality,
//     Subject,
//     OnlineCourse,
// }
//
// public class Target
// {
//     public required TargetType TargetType {get; set;}
//     public required int TargetId { get; set; }
// }
