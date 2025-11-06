// rateLimitMiddleware.ts
import rateLimit from "express-rate-limit";
import { AppError } from "../middlewares/error.middleware";
import logger from "./logger";

// Interface for rate limiter options
export interface IRateLimiter {
  windowMs?: number;
  max?: number;
  message?: string;
}

// Creates a rate limiter middleware that passes errors to the global error handler
export function createRateLimiter(options: IRateLimiter) {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const max = options.max || 100; // Default 100 requests per window

  logger.debug(
    `Creating rate limiter: ${max} requests per ${windowMs}ms window`
  );

  return rateLimit({
    windowMs,
    max,
    handler: (req, res, next) => {
      const message =
        options.message || "Too many requests, please try again later.";
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        windowMs,
        max,
      });
      // Pass a custom 429 error to your error middleware
      next(AppError.tooManyRequestsError(message));
    },
    // Optionally, you can disable the default message
    // message: undefined,
  });
}
