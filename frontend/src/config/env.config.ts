import getEnv from "../utils/get-env";
import logger from "../utils/logger";

const envConfig = () => {
  const config = {
    NODE_ENV: getEnv("MODE", "development"),
    LOG_LEVEL: getEnv("VITE_LOG_LEVEL", "info"),

    // API Configuration
    API_URL: getEnv("VITE_API_URL", "http://localhost:8000/api/v1"),

    // Add other frontend environment variables here
  };

  // Update logger level after Env is initialized
  logger.updateLevelFromEnv(config.LOG_LEVEL, config.NODE_ENV);

  return config;
};

export const Env = envConfig();
