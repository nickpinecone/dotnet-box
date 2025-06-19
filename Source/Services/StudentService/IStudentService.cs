using System.Threading.Tasks;

namespace News.Services.StudentService;

public interface IStudentService
{
    public Task<Student?> GetStudentAsync(int id);
}