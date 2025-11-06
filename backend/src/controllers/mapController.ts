/**
 * Controller for handling learning map API requests
 */
import { type Request, type Response } from "express";
import { z } from "zod";
import { AppError } from "../middlewares/error.middleware";
import { createLearningMap, getLearningMapById } from "../services/mapService";
import { GenerateMapRequest, LearningLevel } from "../types";
import logger from "../utils/logger";

// Validation schema for generate map request
const GenerateMapSchema = z.object({
  topic: z.string().min(1).max(200),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

/**
 * POST /api/map/generate
 * Generates a new learning map for the given topic and level
 */
export async function generateMap(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    // Validate request body
    const validationResult = GenerateMapSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      logger.warn("Invalid request data for map generation", {
        errors: errorDetails,
      });
      return next(
        AppError.validationError("Invalid request data", {
          errors: errorDetails,
        })
      );
    }

    const { topic, level } = validationResult.data as GenerateMapRequest;

    logger.info(`Generating learning map for topic: ${topic}, level: ${level}`);

    // Generate learning map
    const learningMap = await createLearningMap(topic, level, true);

    logger.info(`Successfully generated learning map for topic: ${topic}`);

    // Return the generated map
    res.status(200).json({
      success: true,
      data: learningMap,
    });
  } catch (error) {
    logger.error("Error generating learning map:", error);
    next(error);
  }
}

/**
 * GET /api/map/:id
 * Retrieves a saved learning map by ID
 */
export async function getMapById(
  req: Request,
  res: Response,
  next: any
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      logger.warn("Map ID is required but not provided");
      return next(AppError.emptyOrInvalidData("Map ID is required"));
    }

    logger.debug(`Retrieving learning map with ID: ${id}`);

    const learningMap = await getLearningMapById(id);

    if (!learningMap) {
      logger.warn(`Learning map not found with ID: ${id}`);
      return next(AppError.notFoundError("Learning map"));
    }

    logger.info(`Successfully retrieved learning map with ID: ${id}`);

    res.status(200).json({
      success: true,
      data: learningMap,
    });
  } catch (error) {
    logger.error("Error retrieving learning map:", error);
    next(error);
  }
}
