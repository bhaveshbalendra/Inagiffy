import mongoose from "mongoose";
import { Env } from "../config/env.config";
import { DatabaseConnection } from "../interfaces/database.interface";
import logger from "../utils/logger";

const MONGO_URI = Env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

// Connect to MongoDB
export class MongoDbConnection extends DatabaseConnection {
  async connectDB() {
    try {
      await mongoose.connect(MONGO_URI as string);
      logger.info("Connected to MongoDB");
    } catch (error) {
      logger.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  async disconnectDB() {
    try {
      await mongoose.disconnect();
      logger.info("Disconnected from MongoDB");
    } catch (error) {
      logger.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }
}
