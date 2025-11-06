import { Env } from "./env.config";

/**
 * Application configuration
 * Validates required environment variables before app starts
 */
interface AppConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const requiredEnvVars = {
  // VITE_API_URL is optional - defaults to localhost:3001/api
  // Add other required env vars here if needed
} as const;

const optionalEnvVars = {
  VITE_API_URL: "API base URL",
} as const;

/**
 * Validates required and optional environment variables
 */
function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required environment variables
  for (const [key, description] of Object.entries(requiredEnvVars)) {
    const value = import.meta.env[key];
    if (!value || value.trim() === "") {
      errors.push(`${description} (${key}) is required but not set`);
    }
  }

  // Validate optional environment variables format if provided
  for (const [key, description] of Object.entries(optionalEnvVars)) {
    const value = import.meta.env[key];
    if (value && value.trim() !== "") {
      // Validate API URL format
      if (key === "VITE_API_URL") {
        try {
          new URL(value);
        } catch {
          errors.push(`${description} (${key}) is not a valid URL: ${value}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gets and validates application configuration
 */
export function getAppConfig(): AppConfig {
  const validation = validateConfig();

  if (!validation.valid) {
    throw new Error(
      `Configuration validation failed:\n${validation.errors.join("\n")}`
    );
  }

  return {
    apiUrl: Env.API_URL,
    isDevelopment: Env.NODE_ENV === "development",
    isProduction: Env.NODE_ENV === "production",
  };
}

/**
 * Validates configuration without throwing
 */
export function validateAppConfig(): { valid: boolean; errors: string[] } {
  return validateConfig();
}
