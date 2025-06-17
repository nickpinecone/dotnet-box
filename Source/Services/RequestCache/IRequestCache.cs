using System;
using System.Diagnostics.CodeAnalysis;

namespace News.Services.RequestCache;

public record CacheKey(Type KeyType, object Id);

public interface IRequestCache
{
    public void SetItem<T>(object id, T entity)
        where T : class;

    public T GetItem<T>(object id)
        where T : class;
    
    public bool TryGetItem<T>(object id, [NotNullWhen(true)] out T? entity) 
        where T : class;
}