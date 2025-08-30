// src/state/store.js
import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "./adminApi";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});
