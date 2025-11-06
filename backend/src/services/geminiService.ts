/**
 * Service for integrating with Google Gemini API
 * Handles prompt composition, API calls, and response parsing
 */
import { GoogleGenAI } from "@google/genai";
import { Env } from "../config/env.config";
import { ErrorCodeEnum } from "../enum/error-code.enum";
import { AppError } from "../middlewares/error.middleware";
import { GeminiResponse, LearningLevel, LearningMap } from "../types";
import logger from "../utils/logger";

/**
 * Crafts a precise system prompt for Gemini to generate structured learning maps
 */
function createPrompt(topic: string, level: LearningLevel): string {
  return `Generate a structured, hierarchical learning map for the topic: ${topic}.

Requirements:
- Include 3-5 main branches, each containing 3-4 subtopics
- Each subtopic should include:
  - A clear, concise title
  - A one-sentence overview/description
  - 2-3 suggested learning resources (each with type: "article", "video", or "book", plus title and URL)
- Adapt the complexity of explanations to the ${level} learning level
  - Beginner: Simple explanations, foundational concepts, step-by-step guidance
  - Intermediate: Balanced depth, practical applications, building on fundamentals
  - Advanced: Deep technical details, complex concepts, expert-level content

Return ONLY a valid JSON object with this exact structure:
{
  "branches": [
    {
      "title": "Branch Title",
      "description": "Brief description of this branch",
      "subtopics": [
        {
          "title": "Subtopic Title",
          "description": "One-sentence overview",
          "resources": [
            {
              "type": "article|video|book",
              "title": "Resource Title",
              "url": "https://example.com/resource"
            }
          ]
        }
      ]
    }
  ]
}

Do not include any markdown formatting, code blocks, or additional text. Only return the JSON object.`;
}

/**
 * Validates and parses the Gemini API response
 */
function parseGeminiResponse(responseText: string): GeminiResponse {
  try {
    // Remove any markdown code blocks if present
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(cleanedResponse);

    // Validate structure
    if (!parsed.branches || !Array.isArray(parsed.branches)) {
      throw new Error(
        "Invalid response structure: missing or invalid branches array"
      );
    }

    // Ensure each branch has required fields
    for (const branch of parsed.branches) {
      if (
        !branch.title ||
        !branch.subtopics ||
        !Array.isArray(branch.subtopics)
      ) {
        throw new Error("Invalid branch structure: missing required fields");
      }

      for (const subtopic of branch.subtopics) {
        if (!subtopic.title || !subtopic.description) {
          throw new Error(
            "Invalid subtopic structure: missing required fields"
          );
        }

        if (!subtopic.resources || !Array.isArray(subtopic.resources)) {
          subtopic.resources = [];
        }
      }
    }

    return parsed;
  } catch (error) {
    throw new Error(
      `Failed to parse Gemini response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Calls Gemini API to generate a learning map
 */
export async function generateLearningMap(
  topic: string,
  level: LearningLevel
): Promise<LearningMap> {
  const apiKey = Env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.error("GEMINI_API_KEY is not configured");
    throw AppError.fromErrorCode(
      ErrorCodeEnum.EXTERNAL_SERVICE_ERROR,
      "GEMINI_API_KEY environment variable is not set"
    );
  }

  const geminiInstance = new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY });
  const prompt = createPrompt(topic, level);

  try {
    logger.debug(
      "Making Gemini API request with prompt:",
      prompt.substring(0, 100) + "..."
    );

    const result = await geminiInstance.models.generateContent({
      model: Env.GEMINI_MODEL,
      contents: prompt,
    });

    const responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      logger.error("Gemini API returned empty response");
      throw AppError.fromErrorCode(
        ErrorCodeEnum.EXTERNAL_SERVICE_ERROR,
        "Gemini API returned empty response"
      );
    }

    logger.debug("Gemini API response received successfully");

    // Parse and validate the response
    const parsedResponse = parseGeminiResponse(responseText);

    logger.debug("Successfully parsed Gemini API response");

    // Construct the learning map
    const learningMap: LearningMap = {
      topic,
      level,
      branches: parsedResponse.branches,
    };

    logger.info(
      `Successfully generated learning map with ${parsedResponse.branches.length} branches`
    );

    return learningMap;
  } catch (error: unknown) {
    // Enhanced error handling
    logger.error("Gemini API error occurred:", error);
    let errorStatus = "FETCH_ERROR";
    let errorMessage = String(error);
    let errorCode: string | undefined;

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorStatus = "CUSTOM_ERROR";
        errorMessage = "Google Gemini API key not configured or invalid";
        errorCode = "API_KEY_ERROR";
      } else if (error.message.includes("quota")) {
        errorStatus = "CUSTOM_ERROR";
        errorMessage = "API quota exceeded. Please try again later";
        errorCode = "QUOTA_EXCEEDED";
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorStatus = "FETCH_ERROR";
        errorMessage = "Network error. Please check your connection";
        errorCode = "NETWORK_ERROR";
      } else if (error.message.includes("timeout")) {
        errorStatus = "TIMEOUT_ERROR";
        errorMessage = "Request timed out. Please try again";
        errorCode = "TIMEOUT_ERROR";
      }
    }

    // Map error codes to AppError
    if (errorCode === "API_KEY_ERROR") {
      throw AppError.fromErrorCode(
        ErrorCodeEnum.EXTERNAL_SERVICE_ERROR,
        errorMessage
      );
    } else if (errorCode === "QUOTA_EXCEEDED") {
      throw AppError.fromErrorCode(
        ErrorCodeEnum.TOO_MANY_REQUESTS,
        errorMessage
      );
    } else if (errorCode === "NETWORK_ERROR") {
      throw AppError.fromErrorCode(ErrorCodeEnum.NETWORK_ERROR, errorMessage);
    } else if (errorCode === "TIMEOUT_ERROR") {
      throw AppError.fromErrorCode(
        ErrorCodeEnum.EXTERNAL_SERVICE_TIMEOUT,
        errorMessage
      );
    } else {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }

      // Unknown errors
      throw AppError.fromErrorCode(
        ErrorCodeEnum.EXTERNAL_SERVICE_ERROR,
        errorMessage || "Unknown error occurred while generating learning map"
      );
    }
  }
}
