"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import UserProfileMenu from "@/app/components/layout/UserProfileMenu";

interface CoursePlayerShellProps {
  courseName: string;
  courseId: string;
  children: ReactNode;
}

const CoursePlayerShell: FC<CoursePlayerShellProps> = ({
  courseName,
  courseId,
  children,
}) => (
  <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={`/courses/${courseId}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border bg-card text-muted transition-colors hover:bg-surface hover:text-foreground"
          aria-label="Back to course"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <div className="min-w-0">
          <p className="label hidden sm:block">Now learning</p>
          <p className="truncate text-[14px] font-semibold tracking-[-0.02em] sm:text-[15px]">
            {courseName}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <UserProfileMenu variant="header" compact />
      </div>
    </header>

    <div className="min-h-0 flex-1">{children}</div>
  </div>
);

export default CoursePlayerShell;
