import type {
  GetAllNotificationsResponse,
  UpdateNotificationsResponse,
} from "../types/notification";
import { apiSlice } from "./apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<GetAllNotificationsResponse, void>({
      query: () => "/get-all-notifications",
      providesTags: (result) =>
        result?.notifications
          ? [
              ...result.notifications.map(({ _id }) => ({
                type: "Notification" as const,
                id: _id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),
    updateNotification: builder.mutation<UpdateNotificationsResponse, string>({
      query: (id) => ({
        url: `/update-notification/${id}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
    markAllNotificationsRead: builder.mutation<
      UpdateNotificationsResponse,
      void
    >({
      query: () => ({
        url: "/mark-all-notifications-read",
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useUpdateNotificationMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApiSlice;
