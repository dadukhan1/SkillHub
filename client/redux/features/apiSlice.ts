import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ActivateRequest,
  ApiResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000/api/v1";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    activate: builder.mutation<ApiResponse, ActivateRequest>({
      query: (body) => ({
        url: "/activation",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useActivateMutation,
  useGetMeQuery,
  useLogoutMutation,
} = apiSlice;
