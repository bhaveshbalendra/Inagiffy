/**
 * MongoDB schema for storing generated learning maps
 */
import mongoose, { Document, Schema } from "mongoose";
import { LearningLevel, LearningMap } from "../types";

export interface LearningMapDocument
  extends Document,
    Omit<LearningMap, "createdAt"> {
  createdAt: Date;
}

const LearningResourceSchema = new Schema({
  type: {
    type: String,
    enum: ["article", "video", "book"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const SubTopicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  resources: {
    type: [LearningResourceSchema],
    default: [],
  },
  subtopics: {
    type: [Schema.Types.Mixed],
    default: [],
  },
});

const MainBranchSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subtopics: {
    type: [SubTopicSchema],
    required: true,
  },
});

const LearningMapSchema = new Schema<LearningMapDocument>({
  topic: {
    type: String,
    required: true,
    index: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  branches: {
    type: [MainBranchSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const LearningMapModel = mongoose.model<LearningMapDocument>(
  "LearningMap",
  LearningMapSchema
);
