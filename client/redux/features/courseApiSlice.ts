import type {
  CoursePayload,
  CreateCourseResponse,
  DeleteCourseResponse,
  EditCourseResponse,
  GenerateVideoUrlResponse,
  GetAdminCourseResponse,
  GetAdminCoursesResponse,
  GetCourseContentResponse,
  GetPublicCourseResponse,
} from "../types/course";
import { apiSlice } from "./apiSlice";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourse: builder.query<GetPublicCourseResponse, string>({
      query: (id) => `/get-course/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),
    getCourseContent: builder.query<GetCourseContentResponse, string>({
      query: (id) => `/get-course-content/${id}`,
      providesTags: (_result, _error, id) => [{ type: "CourseContent", id }],
    }),
    generateVideoUrl: builder.mutation<GenerateVideoUrlResponse, string>({
      query: (videoId) => ({
        url: "/generate-video-url",
        method: "POST",
        body: { videoId },
      }),
    }),
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
      invalidatesTags: (result) => [
        { type: "AdminCourse", id: "LIST" },
        ...(result?.course._id
          ? [
              { type: "Course" as const, id: result.course._id },
              { type: "CourseContent" as const, id: result.course._id },
            ]
          : []),
      ],
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
        { type: "Course", id },
        { type: "CourseContent", id },
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
  useGetCourseQuery,
  useGetCourseContentQuery,
  useGenerateVideoUrlMutation,
  useGetAdminCoursesQuery,
  useGetAdminCourseQuery,
  useCreateCourseMutation,
  useEditCourseMutation,
  useDeleteCourseMutation,
} = courseApiSlice;
