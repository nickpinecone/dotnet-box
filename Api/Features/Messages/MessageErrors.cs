namespace Api.Features.Messages;

public static class MessageErrors
{
    public static string NotFound(int id) => $"{NotFound()}: {id}";
    public static string NotFound() => $"Сообщение не найдено";
    
    public static string EmptyMessage() => $"Сообщение не может быть пустым";
}