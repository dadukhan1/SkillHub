import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout } from "../features/authSlice";

const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

const PUBLIC_ENDPOINTS = ["/login", "/register", "/activation", "/refresh-token"];

const getRequestUrl = (args: string | FetchArgs) =>
  typeof args === "string" ? args : args.url;

let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const result = await rawBaseQuery(
        { url: "/refresh-token", method: "GET" },
        api,
        extraOptions,
      );
      return !!result.data;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = getRequestUrl(args);
  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    !PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint))
  ) {
    const refreshed = await refreshAccessToken(api, extraOptions);

    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
