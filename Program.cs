using AppName.Infrastructure.Extensions;
using dotenv.net;
using Microsoft.AspNetCore.Builder;

namespace AppName;

public static class Program
{
    public static void Main(string[] args)
    {        
        DotEnv.Load();
        var builder = WebApplication.CreateBuilder(args);
        builder.ConfigureServices();
        
        var app = builder.Build();
        app.InitializeServices();
        app.MapRoutes(typeof(Program).Assembly);

        app.Run();
    }
}