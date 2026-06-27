"use client";

import { FC } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CoursePreview from "@/app/components/course-player/CoursePreview";
import ThemeToggle from "@/app/components/ThemeToggle";
import UserProfileMenu from "@/app/components/layout/UserProfileMenu";

const CoursePreviewPage: FC = () => {
  const params = useParams<{ id: string }>();
  const courseId = params?.id ?? "";

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-8">
        <Link
          href="/dashboard/courses"
          className="text-[15px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-70"
        >
          SkillHub
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserProfileMenu variant="header" compact />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <CoursePreview courseId={courseId} />
        </div>
      </main>
    </div>
  );
};

export default CoursePreviewPage;
