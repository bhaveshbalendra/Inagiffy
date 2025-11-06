// RTK Query API slice for learning map endpoints
// Uses centralized error handling
import { Env } from "@/config/env.config";
import { type LearningLevel, type LearningMap } from "@/types";
import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  logError,
  normalizeError,
  shouldRetryError,
} from "../../utils/errorHandler";
import logger from "../../utils/logger";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface GenerateMapRequest {
  topic: string;
  level: LearningLevel;
}

// Retry configuration for Render free tier (backend may sleep)
const MAX_RETRIES = 10; // Increased for Render cold start (up to 50 seconds)
const INITIAL_RETRY_DELAY = 5000; // 5 seconds for first retry (backend wake-up)
const RETRY_DELAY = 5000; // 5 seconds for subsequent retries

// Calculate delay for retry (longer delays for cold start)
function calculateRetryDelay(attempt: number): number {
  if (attempt === 0) {
    return INITIAL_RETRY_DELAY; // First retry: wait 5 seconds
  }
  return RETRY_DELAY; // Subsequent retries: wait 5 seconds each
}

// Custom base query with centralized error handling and retry logic
const baseQuery = fetchBaseQuery({
  baseUrl: Env.API_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let retryCount = 0;
  let lastError: FetchBaseQueryError | undefined;

  // Try initial request + retries
  while (retryCount <= MAX_RETRIES) {
    const result = await baseQuery(args, api, extraOptions);

    // Success - return immediately
    if (!result.error) {
      return result;
    }

    // Handle errors centrally
    const normalizedError = normalizeError(result.error);
    lastError = {
      ...result.error,
      data: normalizedError.message,
    } as FetchBaseQueryError;

    // Check if we should retry (before incrementing retryCount)
    const shouldRetry = shouldRetryError(
      normalizedError,
      retryCount,
      MAX_RETRIES
    );

    if (!shouldRetry) {
      // Don't retry - log and return error
      logError(normalizedError);
      return { error: lastError };
    }

    // If we've reached max retries, don't retry again
    if (retryCount >= MAX_RETRIES) {
      logError({
        ...normalizedError,
        message: `${normalizedError.message} (Failed after ${MAX_RETRIES} retries)`,
      });
      return { error: lastError };
    }

    // Log retry attempt
    logger.debug(
      `Retrying request (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`,
      normalizedError.message
    );

    // Wait before retrying (exponential backoff)
    const delay = calculateRetryDelay(retryCount);
    await new Promise((resolve) => setTimeout(resolve, delay));

    retryCount++;
  }

  // Max retries reached - log final error and return
  if (lastError) {
    const normalizedError = normalizeError(lastError);
    logError({
      ...normalizedError,
      message: `${normalizedError.message} (Failed after ${MAX_RETRIES} retries)`,
    });
  }

  return { error: lastError! };
};

export const learningMapApi = createApi({
  reducerPath: "learningMapApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["LearningMap"],
  endpoints: (builder) => ({
    // Generate a new learning map
    generateLearningMap: builder.mutation<LearningMap, GenerateMapRequest>({
      query: (body) => ({
        url: "/map/generate",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<LearningMap>): LearningMap => {
        if (!response.success || !response.data) {
          const error = normalizeError(
            response.error || response.message || "Failed to generate map"
          );
          logError(error);
          throw error;
        }
        return response.data;
      },
      invalidatesTags: ["LearningMap"],
    }),

    // Get a learning map by ID
    getLearningMapById: builder.query<LearningMap, string>({
      query: (id) => `/map/${id}`,
      transformResponse: (response: ApiResponse<LearningMap>): LearningMap => {
        if (!response.success || !response.data) {
          const error = normalizeError(response.error || "Map not found");
          logError(error);
          throw error;
        }
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: "LearningMap", id }],
    }),
  }),
});

export const { useGenerateLearningMapMutation, useGetLearningMapByIdQuery } =
  learningMapApi;
