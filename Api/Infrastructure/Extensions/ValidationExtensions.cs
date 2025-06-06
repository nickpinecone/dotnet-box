using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Api.Infrastructure.Extensions;

public static class ValidationExtensions
{
    public static ValidationProblem ToValidationProblem(this ValidationResult validationResult)
    {
        return TypedResults.ValidationProblem(validationResult.ToDictionary());
    }

    public static bool TryValidate<T>(this IValidator<T> validator, T instance, out ValidationResult result)
    {
        var validation = validator.Validate(instance);
        result = validation;
        return !validation.IsValid;
    }
}