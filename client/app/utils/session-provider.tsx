"use client";

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <SessionProvider>{children}</SessionProvider>
);
