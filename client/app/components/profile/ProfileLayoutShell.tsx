"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import UserProfileMenu from "../layout/UserProfileMenu";

interface ProfileLayoutShellProps {
  children: ReactNode;
}

const ProfileLayoutShell: FC<ProfileLayoutShellProps> = ({ children }) => (
  <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-8">
      <Link
        href="/"
        className="text-[15px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-70"
      >
        SkillHub
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/#courses"
          className="hidden text-[13px] text-muted transition-colors hover:text-foreground sm:block"
        >
          Browse courses
        </Link>
        <ThemeToggle />
        <UserProfileMenu variant="header" compact />
      </div>
    </header>

    <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-10">
      {children}
    </main>
  </div>
);

export default ProfileLayoutShell;
