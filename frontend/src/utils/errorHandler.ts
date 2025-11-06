/**
 * Centralized error handling utility
 * Handles all types of errors (network, API, validation, etc.) in a consistent way
 */
import logger from "./logger";

export const ErrorType = {
  NETWORK: "NETWORK",
  API: "API",
  VALIDATION: "VALIDATION",
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string | number;
  originalError?: unknown;
}

/**
 * Checks if an error is a network error
 */
function isNetworkError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const err = error as { message?: string; code?: string };
    return (
      err.message?.includes("Network") ||
      err.message?.includes("network") ||
      err.message?.includes("fetch failed") ||
      err.message?.includes("Failed to fetch") ||
      err.code === "NETWORK_ERROR" ||
      err.code === "ECONNABORTED"
    );
  }
  return false;
}

/**
 * Checks if an error is an API error (4xx, 5xx)
 */
function isApiError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const err = error as { status?: number; statusCode?: number };
    // RTK Query errors have status property
    return (
      (err.status !== undefined && err.status >= 400 && err.status < 600) ||
      (err.statusCode !== undefined &&
        err.statusCode >= 400 &&
        err.statusCode < 600)
    );
  }
  return false;
}

/**
 * Cleans error message by removing error type prefixes
 * Removes prefixes like "TypeError:", "Error:", "ReferenceError:", etc.
 */
function cleanErrorMessage(message: string): string {
  // Remove common error type prefixes
  const errorPrefixes = [
    /^TypeError:\s*/i,
    /^Error:\s*/i,
    /^ReferenceError:\s*/i,
    /^SyntaxError:\s*/i,
    /^RangeError:\s*/i,
    /^URIError:\s*/i,
    /^EvalError:\s*/i,
  ];

  let cleaned = message;
  for (const prefix of errorPrefixes) {
    cleaned = cleaned.replace(prefix, "");
  }

  return cleaned.trim();
}

/**
 * Extracts error message from various error types
 */
function extractErrorMessage(error: unknown): string {
  let rawMessage = "";

  if (error instanceof Error) {
    rawMessage = error.message;
  } else if (typeof error === "string") {
    rawMessage = error;
  } else if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // RTK Query error format: { status: number, data: { message: string, ... } }
    if (err.data && typeof err.data === "object" && err.data !== null) {
      const data = err.data as Record<string, unknown>;
      if (typeof data.message === "string" && data.message) {
        rawMessage = data.message;
      } else if (typeof data.error === "string" && data.error) {
        rawMessage = data.error;
      }
    }

    // Direct message property
    if (!rawMessage && typeof err.message === "string" && err.message) {
      rawMessage = err.message;
    }

    // Direct error property
    if (!rawMessage && typeof err.error === "string" && err.error) {
      rawMessage = err.error;
    }
  }

  // If no message found, return default
  if (!rawMessage) {
    return "An unexpected error occurred";
  }

  // Clean the message by removing error type prefixes
  return cleanErrorMessage(rawMessage);
}

/**
 * Normalizes error to AppError format
 */
export function normalizeError(error: unknown): AppError {
  const message = extractErrorMessage(error);

  // Check if it's a network error (check both original error and cleaned message)
  const isNetwork =
    isNetworkError(error) ||
    message.toLowerCase().includes("failed to fetch") ||
    message.toLowerCase().includes("network error") ||
    message.toLowerCase().includes("fetch failed");

  if (isNetwork) {
    return {
      type: ErrorType.NETWORK,
      message:
        "Network error. Please check your internet connection and try again.",
      originalError: error,
    };
  }

  if (isApiError(error)) {
    const apiError = error as {
      status?: number;
      statusCode?: number;
      data?: unknown;
    };
    const status = apiError.status || apiError.statusCode;

    // Use the extracted message (which already comes from backend response)
    // Only override with generic messages if the extracted message is generic
    let errorMessage = message;

    // If message is still generic, customize based on status code
    if (message === "An unexpected error occurred" || !message) {
      if (status === 400) {
        errorMessage =
          "Invalid request. Please check your input and try again.";
      } else if (status === 401) {
        errorMessage = "Unauthorized. Please check your credentials.";
      } else if (status === 403) {
        errorMessage = "Access forbidden. You don't have permission.";
      } else if (status === 404) {
        errorMessage = "Resource not found.";
      } else if (status === 429) {
        errorMessage = "Too many requests. Please try again later.";
      } else if (status !== undefined && status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
    }

    return {
      type: ErrorType.API,
      message: errorMessage,
      code: status ?? 500,
      originalError: error,
    };
  }

  return {
    type: ErrorType.UNKNOWN,
    message: message || "An unexpected error occurred",
    originalError: error,
  };
}

/**
 * Gets user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  return normalizeError(error).message;
}

/**
 * Checks if error should be logged
 */
export function shouldLogError(error: AppError): boolean {
  return (
    error.type === ErrorType.API ||
    error.type === ErrorType.NETWORK ||
    error.type === ErrorType.UNKNOWN
  );
}

/**
 * Checks if an error should be retried
 * Retry network errors and 5xx server errors, but not 4xx client errors
 */
export function shouldRetryError(
  error: AppError,
  retryCount: number,
  maxRetries: number = 3
): boolean {
  // Don't retry if max retries reached
  if (retryCount >= maxRetries) {
    return false;
  }

  // Retry network errors
  if (error.type === ErrorType.NETWORK) {
    return true;
  }

  // Retry 5xx server errors (but not 4xx client errors)
  if (error.type === ErrorType.API && error.code) {
    const statusCode =
      typeof error.code === "number"
        ? error.code
        : parseInt(String(error.code));
    return statusCode >= 500 && statusCode < 600;
  }

  // Don't retry validation errors or unknown errors
  return false;
}

/**
 * Logs error to console (in development) or error reporting service (in production)
 */
export function logError(error: AppError): void {
  if (shouldLogError(error)) {
    logger.error("Error:", {
      type: error.type,
      message: error.message,
      code: error.code,
      original: error.originalError,
    });
    // In production, you would send to error reporting service (e.g., Sentry)
    // Example: Sentry.captureException(error.originalError || error);
  }
}
