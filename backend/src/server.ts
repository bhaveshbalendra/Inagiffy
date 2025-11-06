import http from "http";
import app from "./app";
import { Env } from "./config/env.config";
import { MongoDbConnection } from "./utils/connectDB";
import logger from "./utils/logger";

// Create an instance of MongoDbConnection
const connectToDB = new MongoDbConnection();

async function startServer() {
  try {
    // Connect to the database
    await connectToDB.connectDB();

    try {
      //Create HTTP server
      const httpServer = http.createServer(app);

      //Start listening on the specified port, wait for success or error
      await new Promise<void>((resolve, reject) => {
        httpServer.listen(Env.PORT, () => {
          logger.info(`Server running on http://localhost:${Env.PORT}`);
          resolve();
        });
        httpServer.on("error", reject);
      });

      //Handle graceful shutdown on termination signals
      const shutdownSignals = ["SIGINT", "SIGTERM"];

      const shutdownHandler = async (signal: string) => {
        try {
          logger.info(`Received ${signal}. Shutting down gracefully...`);

          // Stop accepting new requests
          httpServer.close(() => {
            logger.info("HTTP server closed");
          });

          // Disconnect from database
          await connectToDB.disconnectDB();

          logger.info("Server shut down gracefully.");
          process.exit(0);
        } catch (error) {
          logger.error(`Error during shutdown: ${error}`);
          process.exit(1);
        }
      };

      shutdownSignals.forEach((signal) => {
        process.on(signal, () => {
          shutdownHandler(signal);
        });
      });
    } catch (serverError) {
      // If server creation or listen fails, disconnect DB and exit
      logger.error("Server failed to start:", serverError);
      await connectToDB.disconnectDB();
      process.exit(1);
    }
  } catch (dbError) {
    // If DB connection fails, log error and exit
    logger.error("Database connection failed:", dbError);
    process.exit(1);
  }
}

startServer();
