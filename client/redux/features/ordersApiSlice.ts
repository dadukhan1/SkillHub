import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => "/get-all-orders",
    }),
    createCheckoutSession: builder.mutation({
      query: (body: { courseId: string }) => ({
        url: "/payment/checkout-session",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery, useCreateCheckoutSessionMutation } =
  ordersApiSlice;
