using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Data;
using Api.Infrastructure.Extensions;
using Api.Infrastructure.Handlers;
using Api.Services.FileStorage;
using Api.Services.RequestCache;
using Api.Services.UserAccessor;
using Api.Signal;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Minio;
using Scalar.AspNetCore;

namespace Api;

public static class Startup
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
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

        builder.Services.Configure<JsonOptions>(o =>
        {
            o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
            o.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        builder.Services.AddMappers(typeof(Program).Assembly);
        builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

        builder.Services.SetupDatabase();
        builder.Services.RegisterServices();
    }

    private static void RegisterServices(this IServiceCollection services)
    {
        services.AddScoped<IUserAccessor, UserAccessor>();
        services.AddScoped<IRequestCache, RequestCache>();

        services.AddMinio(configureClient => configureClient
            .WithEndpoint(Environment.GetEnvironmentVariable("MINIO_URL"))
            .WithCredentials(Environment.GetEnvironmentVariable("MINIO_ROOT_USER"),
                Environment.GetEnvironmentVariable("MINIO_ROOT_PASSWORD"))
            .WithSSL(false)
            .Build()
        );

        services.Configure<FileStorageOptions>(o =>
        {
            o.BucketName = Environment.GetEnvironmentVariable("MINIO_BUCKET")!;
        });
        services.AddSingleton<IFileStorage, MinioStorage>();
    }

    private static void SetupDatabase(this IServiceCollection services)
    {
        var host = Environment.GetEnvironmentVariable("API_POSTGRES_URL");
        var database = Environment.GetEnvironmentVariable("API_POSTGRES_DB");
        var password = Environment.GetEnvironmentVariable("API_POSTGRES_PASSWORD");
        var user = Environment.GetEnvironmentVariable("API_POSTGRES_USER");

        var connection =
            $"Host={host};Port={5432};Database={database};Username={user};Password={password};Include Error Detail=True";

        services.AddDbContext<AppDbContext>(o =>
        {
            o.UseNpgsql(connection);
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

        app.MapHub<SignalHub>("/chats-hub");
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