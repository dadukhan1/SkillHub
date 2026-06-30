import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  ActivateRequest,
  ApiResponse,
  DeleteUserResponse,
  GetAllUsersResponse,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  SocialAuthRequest,
  SocialAuthResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateProfilePictureRequest,
  UpdateUserInfoRequest,
  UpdateUserResponse,
  UpdateUserRoleRequest,
} from "../types/auth";
import { baseQueryWithReauth } from "../utils/baseQueryWithReauth";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "AdminCourse", "Course", "CourseContent", "Layout", "Notification"],
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
    updateUserInfo: builder.mutation<UpdateUserResponse, UpdateUserInfoRequest>({
      query: (body) => ({
        url: "/update-user-info",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<UpdatePasswordResponse, UpdatePasswordRequest>({
      query: (body) => ({
        url: "/update-user-password",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateProfilePicture: builder.mutation<
      UpdateUserResponse,
      UpdateProfilePictureRequest
    >({
      query: (body) => ({
        url: "/update-profile-picture",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: "/get-all-users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation<UpdateUserResponse, UpdateUserRoleRequest>({
      query: (body) => ({
        url: "/update-user-role",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (id) => ({
        url: `/delete-user/${id}`,
        method: "DELETE",
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
  useUpdateUserInfoMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = apiSlice;
