import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";  // import your api.js

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,  // add API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),  // add API middleware
});
