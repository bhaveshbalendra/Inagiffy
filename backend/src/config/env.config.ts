import getEnv from "../utils/get-env";
import logger from "../utils/logger";

const envConfig = () => {
  const config = {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: parseInt(getEnv("PORT", "8000")),
    LOG_LEVEL: getEnv("LOG_LEVEL", "info"),

    ALLOWED_ORIGINS: getEnv("ALLOWED_ORIGINS", "http://localhost:5173").split(
      ","
    ),

    BASE_PATH: getEnv("BASE_PATH", "/api/v1"),

    // MongoDB Configuration
    MONGODB_URI: getEnv("MONGODB_URI", ""),

    // Gemini API Configuration
    GEMINI_API_KEY: getEnv("GEMINI_API_KEY", ""),
    GEMINI_MODEL: getEnv("GEMINI_MODEL", "gemini-pro"),
  };

  // Update logger level after Env is initialized
  logger.updateLevelFromEnv(config.LOG_LEVEL, config.NODE_ENV);

  return config;
};

export const Env = envConfig();
