// src/state/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/admin/general", // ✅ your backend route
  }),
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "/dashboard", // ✅ so full path becomes /api/admin/general/dashboard
    }),
  }),
});

export const { useGetDashboardQuery } = adminApi;
