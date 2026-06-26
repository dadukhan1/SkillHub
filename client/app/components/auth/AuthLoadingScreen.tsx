"use client";

import { FC } from "react";

const AuthLoadingScreen: FC = () => (
  <div className="flex h-dvh max-h-dvh items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-[13px] text-muted">Loading your session…</p>
    </div>
  </div>
);

export default AuthLoadingScreen;
