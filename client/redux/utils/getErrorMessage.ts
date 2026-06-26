import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (!error || typeof error !== "object") return fallback;

  if ("status" in error) {
    const fetchError = error as FetchBaseQueryError;
    const data = fetchError.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (fetchError.status === "FETCH_ERROR") return "Unable to reach the server.";
  }

  if ("message" in error && typeof error.message === "string" && error.message) {
    return error.message;
  }

  return fallback;
};
