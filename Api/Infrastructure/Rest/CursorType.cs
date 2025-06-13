using System;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Text.Json;

namespace Api.Infrastructure.Rest;

// TODO figure out how to make them bind as snake_case
public enum CursorMode
{
    before,
    after,
    around
}

public record CursorType(DateTime Timestamp, int Id) : IParsable<CursorType>
{
    public static string Encode(CursorType cursor)
    {
        var serialize = JsonSerializer.Serialize(cursor);
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(serialize));
    }

    public static CursorType? Decode(string? cursor)
    {
        if (string.IsNullOrEmpty(cursor))
        {
            return null;
        }

        try
        {
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(cursor));
            return JsonSerializer.Deserialize<CursorType>(decoded);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return null;
        }
    }

    public static CursorType Parse(string s, IFormatProvider? provider)
    {
        return Decode(s)!;
    }

    public static bool TryParse([NotNullWhen(true)] string? s, IFormatProvider? provider, [MaybeNullWhen(false)] out CursorType result)
    {
        result = Decode(s);
        return result is not null;
    }
}