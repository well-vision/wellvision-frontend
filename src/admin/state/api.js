import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockDashboardData, mockSalesData, mockUserData, mockProductsData, mockTransactionsData, mockCustomersData, mockGeographyData, mockPerformanceData, mockAdminsData } from "../data/mockData";

// Custom base query that falls back to mock data
const baseQueryWithFallback = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/admin",
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });

  try {
    const result = await baseQuery(args, api, extraOptions);
    
    // If API call fails, return mock data
    if (result.error) {
      console.warn(`API call failed for ${args}, using mock data`);
      return getMockData(args);
    }
    
    return result;
  } catch (error) {
    console.warn(`API call failed for ${args}, using mock data:`, error);
    return getMockData(args);
  }
};

// Function to return appropriate mock data based on endpoint
const getMockData = (args) => {
  const endpoint = typeof args === 'string' ? args : args.url;
  
  if (endpoint === 'general/dashboard') {
    return { data: mockDashboardData };
  } else if (endpoint === 'sales/sales') {
    return { data: mockSalesData };
  } else if (endpoint === 'client/products') {
    return { data: mockProductsData };
  } else if (endpoint === 'client/customers') {
    return { data: mockCustomersData };
  } else if (endpoint === 'client/geography') {
    return { data: mockGeographyData };
  } else if (endpoint === 'client/transactions') {
    return { data: mockTransactionsData };
  } else if (endpoint && endpoint.startsWith('management/performance/')) {
    return { data: mockPerformanceData };
  } else if (endpoint === 'management/admins') {
    return { data: mockAdminsData };
  } else if (endpoint && endpoint.startsWith('general/user/')) {
    return { data: mockUserData };
  } else {
    return { data: null };
  }
};

export const api = createApi({
  baseQuery: baseQueryWithFallback,
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "client/transactions",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;
