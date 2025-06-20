using System.Threading.Tasks;

namespace News.Services.StudentService;

public class StudentService : IStudentService
{
    // TODO grab student information from the student service
    public Task<Student?> GetStudentAsync(int id)
    {
        return Task.FromResult<Student?>(new Student()
        {
            Email = "student@example.com",
            TelegramId = 592566902,
            Id = 0,
        });
    }
}