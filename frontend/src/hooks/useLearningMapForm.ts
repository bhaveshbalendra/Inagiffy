/**
 * Custom hook for managing learning map form state and validation
 */
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearError,
  clearValidationErrors,
  setError,
  setLevel,
  setTopic,
  setValidationErrors,
} from "../store/slices/uiSlice";
import { type LearningLevel } from "../types";
import { formatZodErrors } from "../utils/validation";
import { generateMapRequestSchema } from "../validations/schemas";

export function useLearningMapForm() {
  const dispatch = useAppDispatch();
  const { topic, level, error, validationErrors } = useAppSelector(
    (state) => state.ui
  );

  const handleTopicChange = (value: string) => {
    dispatch(setTopic(value));
    dispatch(clearError());
  };

  const handleLevelChange = (value: LearningLevel) => {
    dispatch(setLevel(value));
    dispatch(clearError());
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find((err) => err.field === fieldName)?.message;
  };

  const validateForm = () => {
    dispatch(clearError());
    dispatch(clearValidationErrors());

    const validationResult = generateMapRequestSchema.safeParse({
      topic: topic.trim(),
      level,
    });

    if (!validationResult.success) {
      const errors = formatZodErrors(validationResult.error);
      dispatch(setValidationErrors(errors));

      const firstError = errors[0];
      if (firstError) {
        dispatch(setError(firstError.message));
      }
      return null;
    }

    return validationResult.data;
  };

  const clearFormError = () => {
    dispatch(clearError());
  };

  return {
    topic,
    level,
    error,
    validationErrors,
    handleTopicChange,
    handleLevelChange,
    getFieldError,
    validateForm,
    clearFormError,
  };
}
