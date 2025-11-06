export const ErrorCodeEnum = {
  // Validation and Resource Errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",

  // Rate Limiting Errors
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  // Database Errors
  DATABASE_QUERY_ERROR: "DATABASE_QUERY_ERROR",

  // External Service Errors (for Gemini API)
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  EXTERNAL_SERVICE_TIMEOUT: "EXTERNAL_SERVICE_TIMEOUT",

  // System Errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ErrorCodeEnumType = keyof typeof ErrorCodeEnum;
