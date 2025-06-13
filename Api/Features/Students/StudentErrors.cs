namespace Api.Features.Students;

public static class StudentErrors
{
    public static string NotFound(int id) => $"{NotFound()}: {id}";
    public static string NotFound() => $"Студент не найден";
}