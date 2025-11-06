/**
 * Service layer for learning map operations
 * Handles business logic and database interactions
 */
import { ErrorCodeEnum } from "../enum/error-code.enum";
import { AppError } from "../middlewares/error.middleware";
import { LearningMapModel } from "../models/LearningMap";
import { LearningLevel, LearningMap } from "../types";
import logger from "../utils/logger";
import { generateLearningMap } from "./geminiService";

/**
 * Generates a new learning map using Gemini API and optionally saves it to database
 */
export async function createLearningMap(
  topic: string,
  level: LearningLevel,
  saveToDb: boolean = true
): Promise<LearningMap> {
  logger.debug(
    `Creating learning map for topic: ${topic}, level: ${level}, saveToDb: ${saveToDb}`
  );

  // Generate map using Gemini
  const learningMap = await generateLearningMap(topic, level);

  // Save to database if requested
  if (saveToDb) {
    try {
      const savedMap = new LearningMapModel(learningMap);
      await savedMap.save();
      logger.info(`Learning map saved to database with ID: ${savedMap._id}`);
    } catch (error) {
      logger.error("Error saving learning map to database:", error);

      // If it's a validation error, throw it as AppError
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        throw AppError.fromErrorCode(
          ErrorCodeEnum.VALIDATION_ERROR,
          "Failed to save learning map: validation error",
          { databaseError: error }
        );
      }

      // For other database errors, throw as database query error
      throw AppError.fromErrorCode(
        ErrorCodeEnum.DATABASE_QUERY_ERROR,
        "Failed to save learning map to database"
      );
    }
  }

  return learningMap;
}

/**
 * Retrieves a learning map from database by ID
 */
export async function getLearningMapById(
  id: string
): Promise<LearningMap | null> {
  try {
    const map = await LearningMapModel.findById(id);
    if (map) {
      logger.debug(`Retrieved learning map from database: ${id}`);
      return map.toObject();
    }
    return null;
  } catch (error) {
    logger.error(`Error retrieving learning map from database: ${id}`, error);

    // Handle invalid ObjectId format
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "CastError"
    ) {
      throw AppError.fromErrorCode(
        ErrorCodeEnum.INVALID_INPUT,
        `Invalid learning map ID format: ${id}`
      );
    }

    // For other database errors
    throw AppError.fromErrorCode(
      ErrorCodeEnum.DATABASE_QUERY_ERROR,
      "Failed to retrieve learning map from database"
    );
  }
}

/**
 * Retrieves all learning maps from database (for analytics)
 */
export async function getAllLearningMaps(
  limit: number = 50,
  skip: number = 0
): Promise<LearningMap[]> {
  try {
    const maps = await LearningMapModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return maps as LearningMap[];
  } catch (error) {
    logger.error("Error retrieving all learning maps from database:", error);
    throw AppError.fromErrorCode(
      ErrorCodeEnum.DATABASE_QUERY_ERROR,
      "Failed to retrieve learning maps from database"
    );
  }
}
