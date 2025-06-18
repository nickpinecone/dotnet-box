using System.Threading.Tasks;
using News.Models;

namespace News.Services.StudentService;

public class StudentService : IStudentService
{
    public Task<Student> GetAsync(int id)
    {
        return Task.FromResult(new Student()
        {
            Email = "",
            TelegramId = 592566902,
            Id = 0,
        });
    }
}