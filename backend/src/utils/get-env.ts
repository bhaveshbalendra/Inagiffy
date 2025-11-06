import * as dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

// Get environment variable with default value
const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key];

  if (value === undefined || value === null || value === "") {
    if (defaultValue === undefined || defaultValue === null) {
      logger.error(
        `Environment variable ${key} is not set and no default value provided.`
      );
      throw new Error(
        `Environment variable ${key} is not set and no default value provided.`
      );
    }
    logger.debug(`Using default value for environment variable: ${key}`);
    return defaultValue;
  }

  logger.debug(`Loaded environment variable: ${key}`);
  return value;
};

export default getEnv;
