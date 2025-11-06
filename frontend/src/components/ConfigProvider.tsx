/**
 * Configuration provider component
 * Validates configuration before rendering the app
 */
import { type ReactNode, useEffect, useState } from "react";
import { validateAppConfig } from "../config/appConfig";
import { Env } from "../config/env.config";
import logger from "../utils/logger";
import { ConfigError } from "./ConfigError";

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [configValid, setConfigValid] = useState<boolean | null>(null);
  const [configErrors, setConfigErrors] = useState<string[]>([]);

  useEffect(() => {
    // Validate configuration on mount
    logger.debug("Validating application configuration");
    const validation = validateAppConfig();

    if (!validation.valid) {
      setConfigValid(false);
      setConfigErrors(validation.errors);
      logger.error("Configuration validation failed:", validation.errors);
    } else {
      setConfigValid(true);
      logger.info("Application configuration validated successfully");
      logger.debug("Environment:", {
        NODE_ENV: Env.NODE_ENV,
        LOG_LEVEL: Env.LOG_LEVEL,
        API_URL: Env.API_URL,
      });
    }
  }, []);

  // Show loading state while validating
  if (configValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Validating configuration...</p>
        </div>
      </div>
    );
  }

  // Show error screen if config is invalid
  if (!configValid) {
    return <ConfigError errors={configErrors} />;
  }

  // Render app if config is valid
  return <>{children}</>;
}
