"use client";

import { FC, useEffect } from "react";
import { useGetMeQuery, useRefreshTokenMutation } from "@/redux/features/apiSlice";
import { useAppSelector } from "@/redux/hooks";

const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

const AuthInitializer: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user, refreshToken]);

  return null;
};

export default AuthInitializer;
