import type {
  CoursePayload,
  CreateCourseResponse,
  DeleteCourseResponse,
  EditCourseResponse,
  GetAdminCourseResponse,
  GetAdminCoursesResponse,
} from "../types/course";
import { apiSlice } from "./apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCourses: builder.query<GetAdminCoursesResponse, void>({
      query: () => "/get-all-courses",
      providesTags: (result) =>
        result?.courses
          ? [
              ...result.courses.map(({ _id }) => ({
                type: "AdminCourse" as const,
                id: _id,
              })),
              { type: "AdminCourse", id: "LIST" },
            ]
          : [{ type: "AdminCourse", id: "LIST" }],
    }),
    getAdminCourse: builder.query<GetAdminCourseResponse, string>({
      query: (id) => `/get-admin-course/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AdminCourse", id }],
    }),
    createCourse: builder.mutation<CreateCourseResponse, CoursePayload>({
      query: (body) => ({
        url: "/create-course",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AdminCourse", id: "LIST" }],
    }),
    editCourse: builder.mutation<
      EditCourseResponse,
      { id: string; body: CoursePayload }
    >({
      query: ({ id, body }) => ({
        url: `/edit-course/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminCourse", id },
        { type: "AdminCourse", id: "LIST" },
      ],
    }),
    deleteCourse: builder.mutation<DeleteCourseResponse, string>({
      query: (id) => ({
        url: `/delete-course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AdminCourse", id },
        { type: "AdminCourse", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAdminCoursesQuery,
  useGetAdminCourseQuery,
  useCreateCourseMutation,
  useEditCourseMutation,
  useDeleteCourseMutation,
} = courseApiSlice;
