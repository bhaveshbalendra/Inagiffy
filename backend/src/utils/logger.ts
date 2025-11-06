/**
 * Simple Logger Utility
 * Supports different log levels with timestamps
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private level: LogLevel;

  constructor() {
    // Get log level from process.env directly to avoid circular dependency
    // Env config will be used after initialization
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    const nodeEnv = process.env.NODE_ENV?.toLowerCase();
    this.level =
      envLevel && LOG_LEVELS[envLevel] !== undefined
        ? envLevel
        : nodeEnv === "production"
        ? "info"
        : "debug";
  }

  /**
   * Update log level from Env config (call this after Env is initialized)
   */
  updateLevelFromEnv(envLogLevel: string, nodeEnv: string): void {
    const envLevel = envLogLevel?.toLowerCase() as LogLevel;
    if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
      this.level = envLevel;
    } else if (nodeEnv === "production") {
      this.level = "info";
    } else {
      this.level = "debug";
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message);

    switch (level) {
      case "debug":
        console.log(formattedMessage, ...args);
        break;
      case "info":
        console.info(formattedMessage, ...args);
        break;
      case "warn":
        console.warn(formattedMessage, ...args);
        break;
      case "error":
        console.error(formattedMessage, ...args);
        break;
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log("debug", message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log("info", message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log("warn", message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log("error", message, ...args);
  }

  setLevel(level: LogLevel): void {
    if (LOG_LEVELS[level] !== undefined) {
      this.level = level;
    } else {
      this.warn(
        `Invalid log level: ${level}. Using current level: ${this.level}`
      );
    }
  }

  getLevel(): LogLevel {
    return this.level;
  }
}

// Export default logger instance
const logger = new Logger();
export default logger;
