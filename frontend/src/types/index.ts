/**
 * Type definitions for learning map data structures (shared with backend)
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
  createdAt?: string;
}
