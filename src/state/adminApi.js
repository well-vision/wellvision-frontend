// src/state/adminApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api" }), // ✅ Change if needed
  tagTypes: [
    "Dashboard", "Products", "Customers", "Transactions",
    "Geography", "Sales", "Performance", "Admins"
  ],
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
    getProducts: builder.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: builder.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: builder.query({
      query: ({ page = 1, pageSize = 20, sort = "", search = "" }) =>
        `client/transactions?page=${page}&pageSize=${pageSize}&sort=${sort}&search=${search}`,
      providesTags: ["Transactions"],
    }),
    getGeography: builder.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: builder.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: builder.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getPerformance: builder.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetPerformanceQuery,
} = adminApi;
