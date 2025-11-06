/**
 * UI state slice for managing UI-related state
 */
import { type LearningLevel } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FieldError {
  field: string;
  message: string;
}

interface UiState {
  topic: string;
  level: LearningLevel;
  error: string | null;
  validationErrors: FieldError[];
}

const initialState: UiState = {
  topic: "",
  level: "Beginner",
  error: null,
  validationErrors: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload;
      // Clear validation errors for this field when user types
      state.validationErrors = state.validationErrors.filter(
        (err) => err.field !== "topic"
      );
    },
    setLevel: (state, action: PayloadAction<LearningLevel>) => {
      state.level = action.payload;
      // Clear validation errors for this field when user changes level
      state.validationErrors = state.validationErrors.filter(
        (err) => err.field !== "level"
      );
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setValidationErrors: (state, action: PayloadAction<FieldError[]>) => {
      state.validationErrors = action.payload;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = [];
    },
    clearFieldError: (state, action: PayloadAction<string>) => {
      state.validationErrors = state.validationErrors.filter(
        (err) => err.field !== action.payload
      );
    },
    resetForm: (state) => {
      state.topic = "";
      state.level = "Beginner";
      state.error = null;
      state.validationErrors = [];
    },
  },
});

export const {
  setTopic,
  setLevel,
  setError,
  clearError,
  setValidationErrors,
  clearValidationErrors,
  clearFieldError,
  resetForm,
} = uiSlice.actions;
export default uiSlice.reducer;
