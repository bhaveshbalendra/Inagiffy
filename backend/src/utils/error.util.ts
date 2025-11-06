import { HTTPSTATUS } from "../config/http.config";
import { type ErrorCodeEnumType } from "../enum/error-code.enum";
import { AppError } from "../middlewares/error.middleware";
import logger from "./logger";

// Error code to HTTP status mapping
const ERROR_CODE_TO_STATUS: Record<ErrorCodeEnumType, number> = {
  // Validation and Resource Errors
  VALIDATION_ERROR: HTTPSTATUS.BAD_REQUEST,
  INVALID_INPUT: HTTPSTATUS.BAD_REQUEST,

  // Rate Limiting Errors
  TOO_MANY_REQUESTS: HTTPSTATUS.TOO_MANY_REQUESTS,

  // Database Errors
  DATABASE_QUERY_ERROR: HTTPSTATUS.INTERNAL_SERVER_ERROR,

  // External Service Errors (for Gemini API)
  EXTERNAL_SERVICE_ERROR: HTTPSTATUS.BAD_GATEWAY,
  EXTERNAL_SERVICE_TIMEOUT: HTTPSTATUS.GATEWAY_TIMEOUT,

  // System Errors
  INTERNAL_SERVER_ERROR: HTTPSTATUS.INTERNAL_SERVER_ERROR,
  NETWORK_ERROR: HTTPSTATUS.SERVICE_UNAVAILABLE,
};

// Create an AppError with the appropriate HTTP status code based on error code
// Parameters: errorCode - The error code from ErrorCodeEnum, message - Custom error message (optional), details - Additional error details (optional)
// Returns AppError instance
export const createError = (
  errorCode: ErrorCodeEnumType,
  message?: string,
  details?: Record<string, any>
): AppError => {
  const statusCode = ERROR_CODE_TO_STATUS[errorCode];
  const errorMessage = message || getDefaultErrorMessage(errorCode);

  const error = new AppError(errorMessage, statusCode);

  if (details) {
    error.errors = details;
  }

  // Log error creation for debugging
  logger.debug(`Error created: ${errorCode} - ${errorMessage}`, {
    statusCode,
    details,
  });

  return error;
};

// Get default error message for error code
// Parameters: errorCode - The error code from ErrorCodeEnum
// Returns Default error message
export const getDefaultErrorMessage = (
  errorCode: ErrorCodeEnumType
): string => {
  const messages: Record<ErrorCodeEnumType, string> = {
    // Validation and Resource Errors
    VALIDATION_ERROR: "Validation failed.",
    INVALID_INPUT: "Invalid input provided.",

    // Rate Limiting Errors
    TOO_MANY_REQUESTS: "Too many requests. Please try again later.",

    // Database Errors
    DATABASE_QUERY_ERROR: "Database query failed.",

    // External Service Errors (for Gemini API)
    EXTERNAL_SERVICE_ERROR: "External service error occurred.",
    EXTERNAL_SERVICE_TIMEOUT: "External service timeout.",

    // System Errors
    INTERNAL_SERVER_ERROR: "Internal server error occurred.",
    NETWORK_ERROR: "Network error occurred.",
  };

  return messages[errorCode] || "An error occurred.";
};

// Check if an error code represents a client error (4xx)
// Parameters: errorCode - The error code from ErrorCodeEnum
// Returns True if it's a client error
export const isClientError = (errorCode: ErrorCodeEnumType): boolean => {
  const statusCode = ERROR_CODE_TO_STATUS[errorCode];
  return statusCode >= 400 && statusCode < 500;
};

// Check if an error code represents a server error (5xx)
// Parameters: errorCode - The error code from ErrorCodeEnum
// Returns True if it's a server error
export const isServerError = (errorCode: ErrorCodeEnumType): boolean => {
  const statusCode = ERROR_CODE_TO_STATUS[errorCode];
  return statusCode >= 500 && statusCode < 600;
};
