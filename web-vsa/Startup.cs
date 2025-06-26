using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using WebVsa.Infrastructure.Extensions;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Minio;
using Scalar.AspNetCore;
using WebVsa.Data;
using WebVsa.Infrastructure.Handlers;
using WebVsa.Services.FileStorage;
using WebVsa.Signal;

namespace WebVsa;

public static class Startup
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Configuration.AddEnvironmentVariables();
        var appSettings = new AppSettings();
        builder.Configuration.Bind(appSettings);
        builder.Services.AddSingleton(appSettings);

        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();
        builder.Logging.AddDebug();

        builder.Services.AddHttpContextAccessor();
        builder.Services.AddProblemDetails();
        builder.Services.AddExceptionHandler<ExceptionHandler>();
        builder.Services.AddHttpClient();
        builder.Services.AddHealthChecks();
        builder.Services.AddSignalR();
        builder.Services.AddOpenApi();

        builder.Services.ConfigureHttpJsonOptions(o =>
        {
            o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
            o.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        builder.Services.AddMappers(typeof(Program).Assembly);
        builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

        builder.Services.RegisterServices(appSettings);
        builder.Services.SetupDatabase(appSettings);
    }

    private static void RegisterServices(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddMinio(configureClient => configureClient
            .WithEndpoint(appSettings.MINIO_URL)
            .WithCredentials(appSettings.MINIO_ROOT_USER, appSettings.MINIO_ROOT_PASSWORD)
            .WithSSL(false)
            .Build()
        );

        services.Configure<FileStorageOptions>(o =>
        {
            o.BucketName = appSettings.MINIO_BUCKET;
        });
        services.AddSingleton<IFileStorage, FileStorage>();
    }

    private static void SetupDatabase(this IServiceCollection services, AppSettings appSettings)
    {
        var host = appSettings.POSTGRES_URL;
        var database = appSettings.POSTGRES_DB;
        var password = appSettings.POSTGRES_PASSWORD;
        var user = appSettings.POSTGRES_USER;

        var connection =
            $"Host={host};Port={5432};Database={database};Username={user};Password={password};Include Error Detail=True";

        services.AddDbContext<AppDbContext>(o =>
        {
            o.UseNpgsql(connection);
            o.UseProjectables();
            o.ConfigureWarnings(w => w.Throw(RelationalEventId.MultipleCollectionIncludeWarning));
        });
    }

    public static void InitializeServices(this WebApplication app)
    {
        app.UseRequestLocalization((o) => o.SetDefaultCulture("ru"));
        app.MigrateDatabase();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();

            app.MapScalarApiReference(o =>
            {
                o.Servers =
                [
                    new ScalarServer("http://localhost:5000")
                ];
                o.DefaultHttpClient = new(ScalarTarget.JavaScript, ScalarClient.Fetch);
            });
        }

        app.UseExceptionHandler();
        app.UseHealthChecks("/healthy");

        app.MapHub<SignalHub>("/webvsa-hub");
    }

    private static void MigrateDatabase(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
    }
}