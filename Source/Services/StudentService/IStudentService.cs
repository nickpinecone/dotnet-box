using System.Threading.Tasks;
using News.Models;

namespace News.Services.StudentService;

public interface IStudentService
{
    public Task<Student> GetAsync(int id);
}