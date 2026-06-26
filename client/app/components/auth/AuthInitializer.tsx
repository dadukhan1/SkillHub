"use client";

import { FC, useCallback, useEffect } from "react";
import { useGetMeQuery, useRefreshTokenMutation } from "@/redux/features/apiSlice";
import { logout, setSessionReady } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { REFRESH_INTERVAL_MS } from "@/redux/utils/baseQueryWithReauth";

const AuthInitializer: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const sessionReady = useAppSelector((state) => state.auth.sessionReady);
  const [refreshToken] = useRefreshTokenMutation();

  const refreshSession = useCallback(async () => {
    try {
      await refreshToken().unwrap();
      return true;
    } catch {
      return false;
    }
  }, [refreshToken]);

  // Bootstrap: refresh access token from httpOnly cookie before any protected request
  useEffect(() => {
    let cancelled = false;

    (async () => {
      await refreshSession();
      if (!cancelled) {
        dispatch(setSessionReady(true));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, refreshSession]);

  useGetMeQuery(undefined, {
    skip: !sessionReady,
    refetchOnMountOrArgChange: true,
  });

  // Proactive refresh while logged in (access token TTL is ~5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const ok = await refreshSession();
      if (!ok) dispatch(logout());
    }, REFRESH_INTERVAL_MS);

    const handleVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      const ok = await refreshSession();
      if (!ok) dispatch(logout());
    };

    const handleFocus = async () => {
      const ok = await refreshSession();
      if (!ok) dispatch(logout());
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, refreshSession, dispatch]);

  return null;
};

export default AuthInitializer;
