namespace News.Features.Newsletters;

public static class NewsletterErrors
{
    public static string NotFound(int id) => $"{NotFound()}: {id}";
    public static string NotFound() => $"Рассылка не найдена";
    
    public static string Empty() => $"Рассылка не может быть пустой";
    public static string NoRecipients() => $"Рассылка должна иметь хотя бы одного получателя";
}