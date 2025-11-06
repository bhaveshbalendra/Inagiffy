import { type NextFunction, type Request, type Response } from "express";

import { HTTPSTATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enum/error-code.enum";
import { createError } from "../utils/error.util";
import getEnv from "../utils/get-env";
import logger from "../utils/logger";

// Custom error class for application-specific errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  path?: string;
  code?: string;
  value?: string;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    // Capture stack trace if available (Node.js only)
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Creating a validation error instance
  static validationError(
    message: string,
    errors: Record<string, any>
  ): AppError {
    const error = new AppError(message, HTTPSTATUS.BAD_REQUEST);
    error.errors = errors;
    return error;
  }

  // Creating a not found error instance
  // entity - The name of the entity that was not found
  // Returns Instance of AppError with not found error
  static notFoundError(entity = "Resource"): AppError {
    return new AppError(`${entity} not found`, HTTPSTATUS.NOT_FOUND);
  }

  // Creating 400 Invalid data or empty error instance
  static emptyOrInvalidData(message = "Data Invalid or Empty"): AppError {
    return new AppError(message, HTTPSTATUS.BAD_REQUEST);
  }

  // Rate limit error
  static tooManyRequestsError(message: string): AppError {
    return new AppError(message, HTTPSTATUS.TOO_MANY_REQUESTS);
  }

  // Create error using error code
  static fromErrorCode(
    errorCode: keyof typeof ErrorCodeEnum,
    message?: string,
    details?: Record<string, any>
  ): AppError {
    return createError(errorCode, message, details);
  }
}

// Express error-handling middleware.
// Handles different error types and sends appropriate responses to the client.
// It captures the error, logs it in development mode, and sends a JSON response.
// Parameters: error - Error object, request - Express request object, response - Express response object, next - Express next function
export const handleError = (
  error: any, // Accept any error object for broad compatibility
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Set default values for statusCode and message
  // If the error object does not have a statusCode or message, set them to default values
  const statusCode = error.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || "Internal Server Error";

  // Initialize node_env from config or set to default value
  const node_env = getEnv("NODE_ENV", "development");

  // Log all errors (not just in development)
  logger.error("Error occurred:", {
    message: error.message,
    statusCode,
    stack: error.stack,
    name: error.name,
  });

  // Handle Mongoose validation errors
  if (error.name === "ValidationError") {
    const validationErrors: Record<string, string> = {};

    Object.keys(error.errors || {}).forEach((key) => {
      validationErrors[key] =
        error.errors?.[key]?.message || "Unknown validation error";
    });

    response.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: "Validation Error",
      errors: validationErrors,
    });
    return;
  }

  // Handle MongoDB duplicate key errors (e.g., unique index violation)
  if (Number(error.code) === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    response.status(HTTPSTATUS.CONFLICT).json({
      success: false,
      message: `${
        field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"
      } already exists`,
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId, etc.)
  if (error.name === "CastError") {
    response.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: `Invalid ${error.path || "field"}: ${error.value}`,
    });
    return;
  }

  // Check if the error is an instance of AppError (custom application errors)
  if (error instanceof AppError) {
    const responseData: any = {
      success: false,
      message: message,
    };

    // Include additional validation errors if present
    if (error.errors) {
      responseData.errors = error.errors;
    }

    // Respond with the error details
    response.status(statusCode).json(responseData);
    return;
  }

  // For unknown errors, convert to AppError with INTERNAL_SERVER_ERROR
  // This ensures consistent error handling
  logger.error("Unhandled error type, converting to AppError:", error);

  const internalError = AppError.fromErrorCode(
    ErrorCodeEnum.INTERNAL_SERVER_ERROR,
    node_env === "development" ? message : "Internal server error"
  );

  response.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: internalError.message,
    ...(node_env === "development" && error.stack
      ? { stack: error.stack }
      : {}),
  });

  // Return to prevent further processing
  // This is important to prevent the server from continuing to process the request after an error has occurred
  return;
};
