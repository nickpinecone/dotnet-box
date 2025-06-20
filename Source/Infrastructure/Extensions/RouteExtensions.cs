using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;

namespace Newleaf.Infrastructure.Extensions;

public interface IRoute
{
    void MapRoutes(WebApplication app);
}

public static class RouteExtensions
{
    public static void MapRoutes(this WebApplication app, Assembly assembly)
    {
        var routes = assembly
            .GetTypes()
            .Where(t => t.IsAssignableTo(typeof(IRoute)) && !t.IsAbstract && !t.IsInterface)
            .Select(Activator.CreateInstance)
            .Cast<IRoute>();

        foreach (var route in routes)
        {
            route.MapRoutes(app);
        }
    }
}