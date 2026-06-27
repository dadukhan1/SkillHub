import { apiSlice } from "./apiSlice";
import type {
  GetUsersAnalyticsResponse,
  GetOrdersAnalyticsResponse,
  GetCoursesAnalyticsResponse,
} from "../types/analytics";

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersAnalytics: builder.query<GetUsersAnalyticsResponse, void>({
      query: () => "/get-users-analytics",
      providesTags: [{ type: "Analytics" as any, id: "USERS" }],
    }),
    getOrdersAnalytics: builder.query<GetOrdersAnalyticsResponse, void>({
      query: () => "/get-orders-analytics",
      providesTags: [{ type: "Analytics" as any, id: "ORDERS" }],
    }),
    getCoursesAnalytics: builder.query<GetCoursesAnalyticsResponse, void>({
      query: () => "/get-courses-analytics",
      providesTags: [{ type: "Analytics" as any, id: "COURSES" }],
    }),
  }),
});

export const {
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
  useGetCoursesAnalyticsQuery,
} = analyticsApiSlice;
