import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  ActivateRequest,
  ApiResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  SocialAuthRequest,
  SocialAuthResponse,
} from "../types/auth";
import { baseQueryWithReauth } from "../utils/baseQueryWithReauth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
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
    socialAuth: builder.mutation<SocialAuthResponse, SocialAuthRequest>({
      query: (body) => ({
        url: "/social-auth",
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
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/refresh-token",
        method: "GET",
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
  useSocialAuthMutation,
  useActivateMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLogoutMutation,
} = apiSlice;
