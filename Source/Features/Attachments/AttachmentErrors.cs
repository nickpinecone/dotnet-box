namespace News.Features.Attachments;

public static class AttachmentErrors
{
    public static string NotFound(int id) => $"{NotFound()}: {id}";
    public static string NotFound() => $"Файл не найден";

    public static string DownloadFailed(int id) => $"Ошибка при загрузке файла: {id}";
}