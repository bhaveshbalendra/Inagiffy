/**
 * Redux store configuration
 */
import { configureStore } from "@reduxjs/toolkit";
import { learningMapApi } from "./api/learningMapApi";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    [learningMapApi.reducerPath]: learningMapApi.reducer,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(learningMapApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
