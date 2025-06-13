using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Api.Services.RequestCache;

public class RequestCache : IRequestCache
{
    private readonly Dictionary<CacheKey, object> _cache = new();

    public void SetItem<T>(object id, T entity) 
        where T : class
    {
        var key = new CacheKey(typeof(T), id);
        _cache[key] = entity;
    }

    public T GetItem<T>(object id) 
        where T : class
    {
        var key = new CacheKey(typeof(T), id);
        return (T)_cache[key];
    }

    public bool TryGetItem<T>(object id, [NotNullWhen(true)] out T? entity) 
        where T : class
    {
        var key = new CacheKey(typeof(T), id);

        if (_cache.TryGetValue(key, out var cachedEntity))
        {
            entity = (T)cachedEntity;
            return true;
        }

        entity = null;
        return false;
    }
}