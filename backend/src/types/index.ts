/**
 * Type definitions for learning map data structures
 */

export type LearningLevel = "Beginner" | "Intermediate" | "Advanced";

export interface LearningResource {
  type: "article" | "video" | "book";
  title: string;
  url: string;
}

export interface SubTopic {
  title: string;
  description: string;
  resources: LearningResource[];
  subtopics?: SubTopic[];
}

export interface MainBranch {
  title: string;
  description: string;
  subtopics: SubTopic[];
}

export interface LearningMap {
  topic: string;
  level: LearningLevel;
  branches: MainBranch[];
  createdAt?: Date;
}

export interface GenerateMapRequest {
  topic: string;
  level: LearningLevel;
}

export interface GeminiResponse {
  branches: MainBranch[];
}
