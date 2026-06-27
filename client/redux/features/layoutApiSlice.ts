import { apiSlice } from "./apiSlice";
import type { GetLayoutResponse, UpdateLayoutResponse, LayoutPayload } from "../types/layout";

export const layoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLayoutByType: builder.query<GetLayoutResponse, string>({
      query: (type) => `/get-layout/${type}`,
      providesTags: (_result, _error, type) => [{ type: "Layout" as any, id: type }],
    }),
    editLayout: builder.mutation<UpdateLayoutResponse, LayoutPayload>({
      query: (body) => ({
        url: "/edit-layout",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Layout" as any, id: arg.type }],
    }),
  }),
});

export const { useGetLayoutByTypeQuery, useEditLayoutMutation } = layoutApiSlice;
