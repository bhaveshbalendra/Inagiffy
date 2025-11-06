/**
 * Centralized validation utilities
 * Handles Zod validation errors and converts them to user-friendly messages
 */
import { ZodError, type ZodIssue } from "zod";
import { ErrorType } from "./errorHandler";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Converts Zod errors to user-friendly validation errors
 */
export function formatZodErrors(error: ZodError): ValidationError[] {
  return error.issues.map((issue: ZodIssue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message || "Invalid input",
  }));
}

/**
 * Gets the first validation error message
 */
export function getFirstValidationError(error: ZodError): string {
  const errors = formatZodErrors(error);
  return errors[0]?.message || "Validation failed";
}

/**
 * Gets all validation error messages
 */
export function getAllValidationErrors(error: ZodError): string[] {
  return formatZodErrors(error).map((err) => err.message);
}

/**
 * Gets validation error for a specific field
 */
export function getFieldError(
  error: ZodError,
  fieldName: string
): string | undefined {
  const errors = formatZodErrors(error);
  return errors.find((err) => err.field === fieldName)?.message;
}

/**
 * Checks if a Zod error exists
 */
export function isValidationError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

/**
 * Normalizes validation error to AppError format
 */
export function normalizeValidationError(error: ZodError): {
  type: ErrorType;
  message: string;
  errors: ValidationError[];
} {
  const validationErrors = formatZodErrors(error);
  const firstError = validationErrors[0];

  return {
    type: ErrorType.VALIDATION,
    message: firstError?.message || "Validation failed",
    errors: validationErrors,
  };
}
