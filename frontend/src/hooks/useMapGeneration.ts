/**
 * Custom hook for generating learning maps using RTK Query
 */
import { useEffect, useState } from "react";
import { useGenerateLearningMapMutation } from "../store/api/learningMapApi";
import { useAppDispatch } from "../store/hooks";
import { clearError, setError } from "../store/slices/uiSlice";
import { type LearningMap } from "../types";
import { getErrorMessage } from "../utils/errorHandler";
import { type GenerateMapRequestInput } from "../validations/schemas";

export function useMapGeneration() {
  const dispatch = useAppDispatch();
  const [learningMap, setLearningMap] = useState<LearningMap | null>(null);
  const [generateLearningMap, { isLoading, error: apiError }] =
    useGenerateLearningMapMutation();

  // Update error state when API error changes
  useEffect(() => {
    if (apiError) {
      const errorMessage = getErrorMessage(apiError);
      dispatch(setError(errorMessage));
    }
  }, [apiError, dispatch]);

  const generateMap = async (data: GenerateMapRequestInput) => {
    dispatch(clearError());
    setLearningMap(null);

    try {
      const result = await generateLearningMap(data).unwrap();
      setLearningMap(result);
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      dispatch(setError(errorMessage));
      throw err;
    }
  };

  const resetMap = () => {
    setLearningMap(null);
    dispatch(clearError());
  };

  return {
    learningMap,
    isLoading,
    generateMap,
    resetMap,
  };
}
