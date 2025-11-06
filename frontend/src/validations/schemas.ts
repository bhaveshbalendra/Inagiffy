/**
 * Zod validation schemas for form inputs
 * Production-level validation with clear error messages
 */
import { z } from "zod";

/**
 * Learning level enum schema
 */
export const learningLevelSchema = z.enum(
  ["Beginner", "Intermediate", "Advanced"],
  {
    message: "Please select a valid learning level",
  }
);

/**
 * Topic input validation schema
 */
export const topicSchema = z
  .string({ message: "Topic must be a string" })
  .min(1, "Topic is required and cannot be empty")
  .max(200, "Topic must be less than 200 characters")
  .trim()
  .refine((val: string) => val.length > 0, {
    message: "Topic cannot be empty or only whitespace",
  })
  .refine((val: string) => val.length >= 3, {
    message: "Topic must be at least 3 characters long",
  });

/**
 * Generate learning map request schema
 */
export const generateMapRequestSchema = z.object({
  topic: topicSchema,
  level: learningLevelSchema,
});

/**
 * Type inference for validated data
 */
export type GenerateMapRequestInput = z.infer<typeof generateMapRequestSchema>;

/**
 * Form validation schema (for client-side validation)
 */
export const formValidationSchema = z.object({
  topic: topicSchema,
  level: learningLevelSchema,
});

export type FormInput = z.infer<typeof formValidationSchema>;
