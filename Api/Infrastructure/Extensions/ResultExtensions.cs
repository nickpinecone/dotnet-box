using System.Linq;
using FluentResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Api.Infrastructure.Extensions;

public static class ResultExtensions
{
    public static string GetErrorMessage(this Result result)
    {
        return string.Join(", ", result.Errors.Select(e => e.Message));
    }

    public static string GetErrorMessage<T>(this Result<T> result)
    {
        return string.Join(", ", result.Errors.Select(e => e.Message));
    }

    public static BadRequest<ProblemDetails> ToBadRequestProblem(this Result result)
    {
        return TypedResults.BadRequest(
            TypedResults.Problem(
                result.GetErrorMessage(),
                statusCode: StatusCodes.Status400BadRequest
            ).ProblemDetails
        );
    }

    public static NotFound<ProblemDetails> ToNotFoundProblem(this Result result)
    {
        return TypedResults.NotFound(
            TypedResults.Problem(
                result.GetErrorMessage(),
                statusCode: StatusCodes.Status404NotFound
            ).ProblemDetails
        );
    }

    public static BadRequest<ProblemDetails> ToBadRequestProblem<T>(this Result<T> result)
    {
        return TypedResults.BadRequest(
            TypedResults.Problem(
                result.GetErrorMessage(),
                statusCode: StatusCodes.Status400BadRequest
            ).ProblemDetails
        );
    }

    public static NotFound<ProblemDetails> ToNotFoundProblem<T>(this Result<T> result)
    {
        return TypedResults.NotFound(
            TypedResults.Problem(
                result.GetErrorMessage(),
                statusCode: StatusCodes.Status404NotFound
            ).ProblemDetails
        );
    }
}