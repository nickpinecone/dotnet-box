using System.Linq;
using FluentResults;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Newleaf.Infrastructure.Extensions;

public static class ValidationExtensions
{
    public static string GetErrorMessage(this ValidationResult validationResult)
    {
        return string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
    }
    
    public static NotFound<ProblemDetails> ToNotFoundProblem(this ValidationResult validationResult)
    {
        return Result.Fail(validationResult.GetErrorMessage()).ToNotFoundProblem();
    }
    
    public static BadRequest<ProblemDetails> ToBadRequestProblem(this ValidationResult validationResult)
    {
        return Result.Fail(validationResult.GetErrorMessage()).ToBadRequestProblem();
    }
    
    public static ValidationProblem ToValidationProblem(this ValidationResult validationResult)
    {
        return TypedResults.ValidationProblem(validationResult.ToDictionary());
    }
}