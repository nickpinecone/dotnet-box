using System.Threading.Tasks;

namespace Newleaf.Services.StudentService;

public interface IStudentService
{
    public Task<Student?> GetStudentAsync(int id);
}