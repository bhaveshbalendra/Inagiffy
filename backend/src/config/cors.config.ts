import { type CorsOptions } from "cors";
import getEnv from "../utils/get-env";

/**
 * CORS configuration for the application
 * Supports both single origin and multiple origins separated by commas
 * When credentials are used, wildcard (*) is not allowed
 */
// const getAllowedOrigins = (): string | string[] => {
//   const origin = Env.ALLOWED_ORIGINS;

//   // If it's a wildcard and we're in development, default to localhost
//   if (
//     Array.isArray(origin) &&
//     origin.includes("*") &&
//     Env.NODE_ENV === "development"
//   ) {
//     return "http://localhost:5173";
//   }

//   // If it contains commas, split into array
//   // Check if origin is a string before calling .includes() and .split()
//   if (typeof origin === "string" && origin.includes(",")) {
//     // Now 'origin' is guaranteed to be a string
//     return origin.split(",").map((o: string) => o.trim()); // Now 'origin' is guaranteed to be a string
//   }

//   return origin;
// };

// CORS
const corsOptions: CorsOptions = {
  origin:
    getEnv("NODE_ENV", "development") === "production"
      ? getEnv("ALLOWED_ORIGINS", "http://localhost:5173")
          .split(",")
          .map((o: string) => o.trim())
      : getEnv("ALLOWED_ORIGINS", "http://localhost:5173")
          .split(",")
          .map((o: string) => o.trim()),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
  exposedHeaders: ["Authorization"],
};

export default corsOptions;
